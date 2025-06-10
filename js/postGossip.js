import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, serverTimestamp,
  doc, getDoc, updateDoc, arrayUnion
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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

// Only show panel to admin
onAuthStateChanged(auth, (user) => {
  if (user && user.email === "pgsverse@gmail.com") {
    adminPanel.style.display = "block";

    postBtn.addEventListener("click", async () => {
      const text = gossipText.value.trim();
      if (!text) return alert("Please paste some gossip.");

      try {
        const gossipDoc = await addDoc(collection(db, "gossips"), {
          content: text,
          postedAt: serverTimestamp()
        });

        await addDoc(collection(db, "notifications"), {
          userId: "all",
          content: "🔥 New gossip uploaded!",
          type: "gossip",
          relatedId: gossipDoc.id,
          createdAt: serverTimestamp(),
          seen: false
        });

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        await updateDoc(userRef, {
          gossipsPosted: (userData.gossipsPosted || 0) + 1
        });

        await checkAndGiveBadges(user.uid);

        alert("Gossip posted, notification sent, badge checked ✅");
        gossipText.value = "";

      } catch (err) {
        console.error("Error posting gossip:", err);
        alert("Something went wrong: " + err.message);
      }
    });

  } else {
    notAllowed.style.display = "block";
  }
});


// Post gossip + give badges
postBtn.addEventListener("click", async () => {
  console.log("🟡 CLICKED POST!");

  const text = gossipText.value.trim();
  if (!text) {
    alert("Please paste some gossip.");
    return;
  }

  try {
    console.log("🟢 Starting gossip upload...");
    const gossipDoc = await addDoc(collection(db, "gossips"), {
      content: text,
      postedAt: serverTimestamp()
    });
    console.log("✅ Gossip saved with ID:", gossipDoc.id);

    await addDoc(collection(db, "notifications"), {
      userId: "all",
      content: "🔥 New gossip uploaded!",
      type: "gossip",
      relatedId: gossipDoc.id,
      createdAt: serverTimestamp(),
      seen: false
    });
    console.log("✅ Notification sent");

    const user = auth.currentUser;
    console.log("👤 Current user:", user?.email);

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    console.log("📊 User data:", userData);

    await updateDoc(userRef, {
      gossipsPosted: (userData.gossipsPosted || 0) + 1
    });
    console.log("🏆 Updated gossip count");

    await checkAndGiveBadges(user.uid);
    console.log("🎖️ Badges checked");

    alert("Gossip posted, notification sent, badge checked ✅");
    gossipText.value = "";

  } catch (err) {
    console.error("❌ Error posting gossip:", err);
    alert("Something went wrong: " + err.message);
  }
});


// Badge check function
async function checkAndGiveBadges(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const u = userSnap.data();
  const already = u.userBadges || [];
  const give = [];

  const now = new Date();

  const badgeConditions = [
    { id: "gossipGuru", condition: (u.gossipsPosted || 0) >= 10 },
    { id: "goldDigger", condition: (u.vcoins || 0) >= 2000 },
    { id: "starterPack", condition: (u.vcoins || 0) >= 100 },
    { id: "theOG", condition: u.firstLoginAt?.seconds <= 9999999990 }, // put logic for first 20 externally
    { id: "confessionKing", condition: (u.confessionsPosted || 0) >= 10 },
    { id: "nightOwl", condition: now.getHours() >= 0 && now.getHours() < 3 },
    { id: "lurker", condition: (u.logins || 0) >= 7 && (u.gossipsPosted || 0) + (u.confessionsPosted || 0) === 0 },
    { id: "flashbackFreak", condition: (u.gossipsViewed || 0) >= 50 },
    { id: "snitch", condition: (u.reportsGiven || 0) >= 5 },
    { id: "badgeCollector", condition: (already.length || 0) >= 10 },
    { id: "memeLord", condition: (u.reactionsGiven || 0) >= 25 },
    { id: "dailyDose", condition: (u.logins || 0) >= 7 },
    { id: "secretAdmirer", condition: (u.secretLikes || 0) >= 10 },
    { id: "socialAnimal", condition: (u.comments || 0) >= 20 },
    { id: "quizManiac", condition: (u.quizAttempts || 0) >= 10 },
    { id: "firstBlood", condition: (u.firstToAnswer || false) },
    { id: "dramaMagnet", condition: (u.mentionCount || 0) >= 5 },
    { id: "glitchHunter", condition: (u.bugReported || false) },
    { id: "topper", condition: (u.topper || false) },
    { id: "thalaForAReason", condition: (u.thala || 0) >= 7 },
    { id: "goodSamaritan", condition: (u.helpful || false) },
    { id: "activeAF", condition: (u.actions || 0) >= 50 },
    { id: "oneOfUs", condition: (u.verifiedPGS || false) },
    { id: "selfLoveEra", condition: (u.selfConfessed || false) },
    { id: "eventChamp", condition: (u.eventWon || false) },
    { id: "tooOnline", condition: (u.minutesOnline || 0) >= 180 },
    { id: "ghostMode", condition: (u.inactive30Days || false) },
  ];

  for (const badge of badgeConditions) {
    if (badge.condition && !already.includes(badge.id)) {
      give.push(badge.id);
    }
  }

  if (give.length) {
    await updateDoc(userRef, {
      userBadges: arrayUnion(...give)
    });
    console.log("🎉 Badges added:", give);
  }
}

