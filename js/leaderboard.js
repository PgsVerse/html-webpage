import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getFirestore, collection, query, orderBy, limit, onSnapshot
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuoQs8ntO6ityQsMeMwMulk9mO2m4ScVI",
  authDomain: "verse-96d1b.firebaseapp.com",
  projectId: "verse-96d1b",
  storageBucket: "verse-96d1b.appspot.com",
  messagingSenderId: "442515393829",
  appId: "1:442515393829:web:049678d9cb119d4146decc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const tbody = document.querySelector("#leaderboardTable tbody");

const q = query(collection(db, "users"), orderBy("vcoins", "desc"), limit(50));

onSnapshot(q, snapshot => {
  tbody.innerHTML = "";
  let rank = 1;
  snapshot.forEach(doc => {
    const d = doc.data();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${rank++}</td>
      <td>${d.name || "Anonymous"}</td>
      <td>${d.vcoins || 0}</td>
    `;

    tbody.appendChild(tr);
  });
});
