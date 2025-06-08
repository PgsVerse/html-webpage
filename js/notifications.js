// notifications.js
import { getFirestore, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDuoQs8ntO6ityQsMeMwMulk9mO2m4ScVI",
  authDomain: "verse-96d1b.firebaseapp.com",
  projectId: "verse-96d1b",
  storageBucket: "verse-96d1b.appspot.com",
  messagingSenderId: "442515393829",
  appId: "1:442515393829:web:049678d9cb119d4146decc",
  measurementId: "G-3C74806Q83"
};

// 🔁 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔔 Notification Bell
const notifBell = document.getElementById("notif-bell");
const notifDropdown = document.getElementById("notif-dropdown");
const notifList = document.getElementById("notif-list");

notifBell.addEventListener("click", () => {
  notifDropdown.classList.toggle("hidden");
});

import { getFirestore, collection, query, where, or, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


const notifQuery = query(
  collection(db, "notifications"),
  or(
    where("userId", "==", user.uid),
    where("userId", "==", "all")
  )
);


    onSnapshot(notifQuery, (snapshot) => {
      notifList.innerHTML = "";
      if (snapshot.empty) {
        notifList.innerHTML = "<li>No notifications</li>";
      } else {
        snapshot.forEach((doc) => {
          const data = doc.data();
          const li = document.createElement("li");
          li.innerText = data.content;
          notifList.appendChild(li);
        });
      }
    });
  
