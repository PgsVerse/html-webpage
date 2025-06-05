// assume firebase-app, auth, db are imported from firebase-config.js
// e.g. import { auth, db } from './firebase-config.js';
// and Firestore helpers: doc, setDoc, addDoc, collection, getDocs, updateDoc, getDoc

// 1) Post gossip into Firestore:

  const API_URL = 'https://script.google.com/macros/s/AKfycbyXnvkdysWVSVB6yRgpgpFD5_PZSmPonXveG-RvJdTRvNz-4X-B1uzm8UwiJiaoDjOD/exec';  // ← paste your URL

async function postGossip() {
  // …
  const res = await fetch(`${API_URL}?path=gossip`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ userId: user.uid, userName: user.displayName, text })
  });
  // …
}


// 2) Upload file to Firebase Storage and record in Firestore:

async function uploadFile() {
  // …
  const res = await fetch(`${API_URL}?path=resource`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      userId:   user.uid,
      userName: user.displayName,
      fileName: file.name,
      mimeType: file.type,
      base64
    })
  });
  // …

  alert('File uploaded! +Vcoins.');
}

// 3) Populate leaderboard table:
async function loadLeaderboard() {
  const tbody = document.querySelector('#leaderboardTable tbody');
  const q = query(collection(db, 'users'), orderBy('vcoins','desc'), limit(50));
  const snap = await getDocs(q);
  let rank=1;
  snap.forEach(docSnap => {
    const data = docSnap.data();
    const row = document.createElement('tr');
    row.innerHTML = `<td>${rank++}</td><td>${data.name}</td><td>${data.vcoins}</td>`;
    tbody.appendChild(row);
  });
}

// 4) Riddle handling:
const correctAnswer = 'piano';
function submitRiddle() {
  const ans = document.getElementById('riddleAnswer').value.trim().toLowerCase();
  const resp = document.getElementById('riddleResponse');
  if (ans === correctAnswer) {
    resp.textContent = 'Nice! +50 Vcoins.';
    // TODO: credit user
  } else {
    resp.textContent = 'Better luck next time!';
  }
}

// 5) Unlock LoungeVerse:
async function unlockLounge() {
  const user = auth.currentUser;
  if (!user) return alert('Please sign in first.');
  const udoc = await getDoc(doc(db,'users',user.uid));
  if (udoc.data().vcoins >= 25000) {
    await updateDoc(udoc.ref, { unlockedLounge: true });
    alert('Unlocked! Enjoy the Lounge.');
    // maybe redirect to exclusive content
  } else {
    alert('You need 25,000 Vcoins.');
  }
}

// 6) On page load, call these where relevant:
onAuthStateChanged(auth, user => {
  if (user) {
    loadLeaderboard();         // for leaderboard.html
    // loadResources();         // for study.html
    // loadGossip();            // for gossip.html
  }
});







