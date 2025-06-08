import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDuoQs8ntO6ityQsMeMwMulk9mO2m4ScVI",
  authDomain: "verse-96d1b.firebaseapp.com",
  projectId: "verse-96d1b",
  storageBucket: "verse-96d1b.appspot.com",
  messagingSenderId: "442515393829",
  appId: "1:442515393829:web:049678d9cb119d4146decc",
  measurementId: "G-3C74806Q83"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const adminPanel = document.getElementById("admin-panel");
const notAllowed = document.getElementById("not-allowed");
const postBtn = document.getElementById("postGossip");
const gossipText = document.getElementById("gossip-text");

onAuthStateChanged(auth, (user) => {
  if (user && user.email === "pgsverse@gmail.com") {
    adminPanel.style.display = "block";
  } else {
    notAllowed.style.display = "block";
  }
});

postBtn.addEventListener("click", async () => {
  const text = gossipText.value.trim();
  if (!text) return alert("Please paste some gossip.");

  // ✅ Save gossip to Firestore
  const gossipDoc = await addDoc(collection(db, "gossips"), {
    content: text,
    postedAt: serverTimestamp()
  });

  // 🔔 Send notification
  await addDoc(collection(db, "notifications"), {
    userId: "all",
    content: "🔥 New gossip uploaded!",
    type: "gossip",
    relatedId: gossipDoc.id,
    createdAt: serverTimestamp(),
    seen: false
  });

  alert("Gossip posted + notification sent ✅");
  gossipText.value = "";
});
