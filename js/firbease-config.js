// js/firebase-config.js
import { initializeApp }           from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getFirestore }            from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getStorage }              from "https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js";

const firebaseConfig = {
  apiKey:            "AIzaSyDuoQs8ntO6ityQsMeMwMulk9mO2m4ScVI",
  authDomain:        "verse-96d1b.firebaseapp.com",
  projectId:         "verse-96d1b",
  storageBucket:     "verse-96d1b.appspot.com",
  messagingSenderId: "442515393829",
  appId:             "1:442515393829:web:049678d9cb119d4146decc",
  measurementId:     "G-3C74806Q83"
};

const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db       = getFirestore(app);
export const storage  = getStorage(app);
