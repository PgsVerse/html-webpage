import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import {
  getFirestore, doc, setDoc, updateDoc, increment,
  addDoc, getDoc, getDocs, collection, serverTimestamp, query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuoQs8ntO6ityQsMeMwMulk9mO2m4ScVI",
  authDomain: "verse-96d1b.firebaseapp.com",
  projectId: "verse-96d1b",
  storageBucket: "verse-96d1b.appspot.com",
  messagingSenderId: "442515393829",
  appId: "1:442515393829:web:049678d9cb119d4146decc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Upload File
window.uploadFile = async () => {
  const user = auth.currentUser;
  if (!user) return alert("Please sign in first.");

  const file = document.getElementById("fileUpload").files[0];
  if (!file) return alert("Choose a file first!");

  const storageRef = ref(storage, `notes/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, "resources"), {
    name: file.name,
    url,
    uploader: user.displayName || user.email,
    uid: user.uid,
    likes: [],
    timestamp: serverTimestamp()
  });

  await updateDoc(doc(db, "users", user.uid), {
    vcoins: increment(100)
  });

  alert("File uploaded! +100 VCoins.");
  document.getElementById("fileUpload").value = "";
};

// Display files
const fileList = document.getElementById("fileList");

onSnapshot(query(collection(db, "resources"), orderBy("timestamp", "desc")), snap => {
  fileList.innerHTML = "";
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const fileId = docSnap.id;

    const li = document.createElement("li");
    li.innerHTML = `
      📄 <a href="${d.url}" target="_blank">${d.name}</a><br/>
      <small>Uploaded by: ${d.uploader}</small><br/>
      <button class="btn" data-id="${fileId}" style="margin-top: 5px;">
        ❤️ Like (${d.likes.length})
      </button>
      <hr/>
    `;
    fileList.appendChild(li);

    // Like button logic
    const likeBtn = li.querySelector("button");
    likeBtn.onclick = async () => {
      const user = auth.currentUser;
      if (!user) return alert("Sign in to like.");

      const docRef = doc(db, "resources", fileId);
      const snap = await getDoc(docRef);
      const likes = snap.data().likes || [];

      if (likes.includes(user.uid)) {
        alert("You already liked this.");
        return;
      }

      likes.push(user.uid);
      await updateDoc(docRef, { likes });

      await updateDoc(doc(db, "users", d.uid), {
        vcoins: increment(5)
      });

      likeBtn.innerHTML = `❤️ Like (${likes.length})`;
    };
  });
});

// Submit Note Request
window.submitNoteRequest = async () => {
  const user = auth.currentUser;
  if (!user) return alert("Sign in to request notes.");

  const input = document.getElementById("noteRequestInput");
  const text = input.value.trim();
  if (!text) return alert("Type something!");

  await addDoc(collection(db, "requests"), {
    text,
    uid: user.uid,
    name: user.displayName || user.email,
    timestamp: serverTimestamp()
  });

  await updateDoc(doc(db, "users", user.uid), {
    vcoins: increment(5)
  });

  alert("Request submitted! +5 VCoins.");
  input.value = "";
};
