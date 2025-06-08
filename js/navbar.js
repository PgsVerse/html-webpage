import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

// Firebase Config
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

// Dynamic navbar injection
onAuthStateChanged(auth, user => {
  const nav = document.getElementById("nav-links");
  if (!nav) return;

  if (user) {
    nav.innerHTML = `
      <li><a href="index.html">Home</a></li>
      <li><a href="dashboard.html">Dashboard</a></li>
      <li><a href="#" id="signOutBtn">Sign Out</a></li>
    `;
    document.getElementById('signOutBtn').onclick = () =>
      signOut(auth).then(() => location.replace('signin.html'));
  } else {
    nav.innerHTML = `
      <li><a href="index.html">Home</a></li>
      <li><a href="signin.html">Sign In</a></li>
      <li><a href="dashboard.html">Dashboard</a></li>
    `;
  }
});
