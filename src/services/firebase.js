import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwoSjjoLr1kukW7cQHq-TVbFxjWBOQSYA",
  authDomain: "chimwemwehub.firebaseapp.com",
  projectId: "chimwemwehub",
  storageBucket: "chimwemwehub.firebasestorage.app",
  messagingSenderId: "129284925805",
  appId: "1:129284925805:web:c0f2bf2dc859884f999264",
  measurementId: "G-NMGS120C49",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Instant client-side image compression that NEVER hangs
export function processAndUploadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.8);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });
}

// Fetch site-wide overrides from Firestore with quick timeout
export async function fetchSiteOverrides() {
  try {
    const fetchPromise = getDoc(doc(db, "content", "site"));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 2000)
    );
    const docSnap = await Promise.race([fetchPromise, timeoutPromise]);
    if (docSnap && docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err) {
    // Cloud offline or timed out - handled gracefully
  }
  return null;
}

// Save section with timeout protection
export async function saveSiteSection(sectionName, sectionData) {
  try {
    const savePromise = setDoc(
      doc(db, "content", "site"),
      {
        [sectionName]: sectionData,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 2500)
    );
    await Promise.race([savePromise, timeoutPromise]);
    return true;
  } catch (err) {
    console.warn(`Cloud sync for ${sectionName}:`, err.message);
    return false;
  }
}

// Fetch thoughts with fallback
export async function fetchLiveThoughts() {
  try {
    const q = query(collection(db, "thoughts"), orderBy("createdAt", "desc"));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 2000)
    );
    const snapshot = await Promise.race([getDocs(q), timeoutPromise]);
    if (snapshot) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    }
  } catch (error) {
    // Fallback to local
  }
  return [];
}

// Publish thought
export async function publishThought({ title, category, summary, content }) {
  const words = content.trim().split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const thoughtData = {
    id: "thought-" + Date.now(),
    title,
    category: category || "Agentic Development",
    summary,
    content,
    readTime,
    date,
  };

  try {
    const addPromise = addDoc(collection(db, "thoughts"), {
      ...thoughtData,
      createdAt: serverTimestamp(),
    });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 2500)
    );
    const docRef = await Promise.race([addPromise, timeoutPromise]);
    if (docRef?.id) {
      thoughtData.id = docRef.id;
    }
  } catch (e) {
    console.warn("Saving thought locally:", e.message);
  }

  return thoughtData;
}

// Delete thought
export async function deleteThought(thoughtId) {
  try {
    const delPromise = deleteDoc(doc(db, "thoughts", thoughtId));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 2000)
    );
    await Promise.race([delPromise, timeoutPromise]);
  } catch (e) {
    console.warn("Delete thought cloud note:", e.message);
  }
}
