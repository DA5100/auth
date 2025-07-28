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
const auth = firebase.auth();
const ui = new firebaseui.auth.AuthUI(auth);
const user = firebase.auth().currentUser;
const db = firebase.firestore();
const params = new URLSearchParams(window.location.search);
const sK = params.get("serial_key")
const keyRef = db.collection("lisensi").doc(sK);
document.addEventListener("DOMContentLoaded", function(){
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

  if (keyData.email !== user.email) {
    alert("Maaf, Serial key ini tidak cocok dengan akun Anda.");
    auth.signOut();
    return;
  }

  else {
    keyRef.update({
      used: true,
      usedBy: user.email,
    }).then(() => {
      console.log("Serial key berhasil diverifikasi dan digunakan.");
      alert("Serial key berhasil diverifikasi. Terima kasih telah menggunakan layanan kami!");
      window.location.href = "https://da5100.github.io/qrda/?session=" + btoa(sK) + "&email=" + btoa(user.email);
    }).catch((error) => {
      console.error("Gagal memperbarui status serial key:", error);
      alert("Gagal memperbarui status serial key.");
    });
  }

}).catch((error) => {
  console.error("Gagal cek serial key:", error);
  alert("Gagal verifikasi serial key.");
});

})

