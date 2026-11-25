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

// Client-side image compression
export async function compressImage(file, maxDimension = 1920, quality = 0.85) {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob || file),
          "image/jpeg",
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Upload file: tries Firebase Storage first, falls back to Data URL
export async function processAndUploadImage(file) {
  try {
    const compressedBlob = await compressImage(file);
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storageRef = ref(storage, `uploads/${Date.now()}_${cleanName}`);
    await uploadBytes(storageRef, compressedBlob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (storageError) {
    console.warn("Storage upload failed, using Data URL fallback:", storageError.message);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
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
