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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
export const storage = getStorage(app);

// Bulletproof image processor that NEVER hangs
export async function processAndUploadImage(file) {
  return new Promise(async (resolve, reject) => {
    // Hard safety timer to prevent any hanging
    const safetyTimeout = setTimeout(() => {
      try {
        const fallbackReader = new FileReader();
        fallbackReader.onload = () => resolve(fallbackReader.result);
        fallbackReader.onerror = () => reject(new Error("Image processing timed out."));
        fallbackReader.readAsDataURL(file);
      } catch (e) {
        reject(e);
      }
    }, 3500);

    try {
      // 1. Fast client-side canvas compression
      const dataUrl = await new Promise((res) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            try {
              const maxDim = 1280;
              let width = img.width;
              let height = img.height;
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
              const compressed = canvas.toDataURL("image/jpeg", 0.82);
              res(compressed);
            } catch (canvasErr) {
              res(e.target.result);
            }
          };
          img.onerror = () => res(e.target.result);
          img.src = e.target.result;
        };
        reader.onerror = () => res(null);
        reader.readAsDataURL(file);
      });

      if (!dataUrl) {
        clearTimeout(safetyTimeout);
        return reject(new Error("Unable to read image file."));
      }

      // 2. Try fast Firebase Storage upload (strict 2s timeout)
      try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const storageRef = ref(storage, `uploads/${Date.now()}_${cleanName}`);

        const blobRes = await fetch(dataUrl);
        const blob = await blobRes.blob();

        const uploadTask = uploadBytes(storageRef, blob);
        const storageTimeout = new Promise((_, r) =>
          setTimeout(() => r(new Error("Storage timeout")), 2000)
        );

        await Promise.race([uploadTask, storageTimeout]);
        const downloadUrl = await getDownloadURL(storageRef);
        clearTimeout(safetyTimeout);
        return resolve(downloadUrl);
      } catch (storageErr) {
        // Fall back immediately to the compressed dataUrl
        clearTimeout(safetyTimeout);
        return resolve(dataUrl);
      }
    } catch (err) {
      clearTimeout(safetyTimeout);
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => resolve(fallbackReader.result);
      fallbackReader.onerror = () => reject(err);
      fallbackReader.readAsDataURL(file);
    }
  });
}

// Fetch site-wide overrides (profile, projects, certificates)
export async function fetchSiteOverrides() {
  try {
    const docSnap = await getDoc(doc(db, "content", "site"));
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err) {
    console.warn("Could not fetch site overrides:", err.message);
  }
  return null;
}

// Save a specific section to Firestore (e.g. 'profile', 'projects', 'certificates')
export async function saveSiteSection(sectionName, sectionData) {
  try {
    await setDoc(
      doc(db, "content", "site"),
      {
        [sectionName]: sectionData,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error(`Failed to save section ${sectionName}:`, err);
    throw err;
  }
}

// Fetch all dynamic thoughts from Firestore
export async function fetchLiveThoughts() {
  try {
    const q = query(collection(db, "thoughts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.warn("Could not load thoughts from Firestore:", error.message);
    return [];
  }
}

// Publish a new thought
export async function publishThought({ title, category, summary, content }) {
  const words = content.trim().split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const docRef = await addDoc(collection(db, "thoughts"), {
    title,
    category: category || "Agentic Development",
    summary,
    content,
    readTime,
    date,
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id, title, category, summary, content, readTime, date };
}

// Delete a published thought
export async function deleteThought(thoughtId) {
  await deleteDoc(doc(db, "thoughts", thoughtId));
}
