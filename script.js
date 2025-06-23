import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAEESwDuZI4cg0Fj2ojkIPNUr9HL9UyQXg",
  authDomain: "myweb-11c35.firebaseapp.com",
  projectId: "myweb-11c35",
  storageBucket: "myweb-11c35.appspot.com",
  messagingSenderId: "365193314876",
  appId: "1:365193314876:web:9fb786f85e78579ec9f939",
  measurementId: "G-BJZQ2LSXGY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Upload form
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("memeImage").files[0];
  const title = document.getElementById("memeTitle").value;
  const status = document.getElementById("status");

  if (!file || !title) return;

  const storageRef = ref(storage, `memes/${Date.now()}_${file.name}`);
  status.textContent = "Uploading...";

  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "memes"), {
      title: title,
      url: url,
      timestamp: Date.now()
    });

    status.textContent = "✅ Meme uploaded!";
    document.getElementById("uploadForm").reset();
    loadMemes();
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Upload failed!";
  }
});

// Load memes
async function loadMemes() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "memes"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const meme = document.createElement("div");
    meme.className = "meme-card";
    meme.innerHTML = `
      <img src="${data.url}" alt="${data.title}" />
      <p>${data.title}</p>
    `;
    gallery.appendChild(meme);
  });
}

loadMemes();
