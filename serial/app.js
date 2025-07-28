
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
  const db = firebase.firestore();

  document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const sK = params.get("serial_key");

    auth.onAuthStateChanged((user) => {
      // if (!user) {
      //   alert("Anda belum login. Silakan login terlebih dahulu.");
      //   window.location.href = "https://da5100.github.io/auth/";
      //   return;
      // }
      if (user) {
        console.log("User is logged in:", user.displayName); 
      }

      const email = user.email;
      const keyRef = db.collection("lisensi").doc(sK);

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

        if (!keyData.email || keyData.email !== email) {
          alert("Maaf, Serial key ini tidak cocok dengan akun Anda.");
          auth.signOut();
          return;
        }

        // Everything OK → Mark key as used
        keyRef.update({
          used: true,
          usedBy: email,
        }).then(() => {
          alert("Serial key berhasil diverifikasi. Terima kasih telah menggunakan layanan kami!");
          window.location.href = "https://da5100.github.io/qrda/?session=" + btoa(sK) + "&email=" + btoa(email);
        }).catch((error) => {
          console.error("Gagal memperbarui status serial key:", error);
          alert("Gagal memperbarui status serial key.");
        });

      }).catch((error) => {
        console.error("Gagal cek serial key:", error);
        alert("Gagal verifikasi serial key.");
      });
    });
  });

