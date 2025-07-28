const firebaseConfig = {
  apiKey: "AIzaSyBnRKitQGBX0u8k4COtDTILYxCJuMf7xzE",
  authDomain: "authdramaarena.firebaseapp.com",     
  databaseURL: "https://authdramaarena.firebaseio.com",
  projectId: "authdramaarena",                      
  storageBucket: "authdramaarena.appspot.com",      
  messagingSenderId: "348583435302",             
  appId: "1:348583435302:web:someUniqueWebId",    
  measurementId: "G-DGF0CP099H"                  
};

firebase.initializeApp(firebaseConfig);
const user = firebase.auth().currentUser;
const db = firebase.firestore();
// const inputKey = prompt("Masukan Key:");
const keyRef = db.collection("lisensi").doc("serialKey");
document.addEventListener("DOMContentLoaded", function(){
  const inputKey = document.getElementById("inputKey").ariaValueText;
  keyRef.get().then((doc) => {
  if (!doc.exists) {
    alert("Serial key tidak ditemukan.");
    auth.signOut();
    return;
  }

  const keyData = doc.data();

  if (keyData.used) {
    alert("Maaf, Serial key ini sudah digunakan.");
    auth.signOut();
    return;
  }

  if (keyData.blocked) {
    alert("Maaf, Serial key ini diblokir.");
    auth.signOut();
    return;
  }

//   const userRef = db.collection("users").doc(user.uid);

//   userRef.set({
//     email: user.email,
//     name: user.displayName || "Anonymous",
//     serialKey: inputKey,
//     createdAt: firebase.firestore.FieldValue.serverTimestamp()
//   }).then(() => {
//     keyRef.update({
//       used: true,
//       userId: user.uid,
//       usedAt: firebase.firestore.FieldValue.serverTimestamp()
//     });

//     alert("Registrasi berhasil!");
//     updateUI(user);
//   }).catch((error) => {
//     console.error("Gagal menyimpan user:", error);
//     alert("Terjadi kesalahan saat menyimpan data.");
//   });

// }).catch((error) => {
//   console.error("Gagal cek serial key:", error);
//   alert("Gagal verifikasi serial key.");
});

})

