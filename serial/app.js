  const firebaseConfig = {
            apiKey: "AIzaSyCBeFJtPKEMURY-iUDUR4I6gWKjmlTk_3E",
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
      if (!user) {
        openPopup("Error", "Anda harus masuk untuk memverifikasi serial key.", "error", "https://da5100.github.io/auth/");
        // window.location.href = "https://da5100.github.io/auth/";
        return;
      }
      if (user) {
        console.log("User is logged in:", user.displayName);
      }
      const email = String(user.email);
      const rawKey = sK.replace(/-/g, "").toUpperCase();
      const keyRef = db.collection("lisensi").doc(sK);
      const emailmd5 = CryptoJS.MD5(email).toString();

      keyRef.get().then((doc) => {
        if (!doc.exists) {
          alert("Serial key tidak ditemukan.");
          openPopup("Error", "Serial key tidak ditemukan.", "error", null);
          return;
        } 
        const keyData = doc.data();
        if (keyData.used == true && keyData.email !== email) {
          openPopup("Error", "Serial key sudah digunakan", "error", null);
          return;
        } else if (keyData.used == true && keyData.email == email) {
            openPopup("Sukses", "Email & Serial key berhasil diverifikasi.", "success", null);
            window.location.href = "https://da5100.github.io/qrda/?session=" + emailmd5 + "&serial_key=" + sK;
           
        } else if (keyData.blocked == true) {
            openPopup("Error", "Serial key ini diblokir.", "error", null);
            return;
        } 
        else if (keyData.email && keyData.email !== email) {
            openPopup("Error", "Serial key ini tidak cocok dengan akun Anda.", "error", null);
            return;
        } else { 
        keyRef.update({
          used: true,
          email: email,
          }).then(() => {
            openPopup("Sukses", "Serial key berhasil diverifikasi.", "success", "https://da5100.github.io/qrda/?session=" + emailmd5 + "&serial_key=" + sK);
          }).catch((error) => {
            console.error("Gagal memperbarui status serial key:", error);
            openPopup("Error", "Gagal memperbarui status serial key: " + error, "error", null);
          });
        }
      }).catch((error) => {
        console.error("Gagal cek serial key:", error);
        alert("Gagal verifikasi serial key.");
        openPopup("Error", "Gagal verifikasi serial key: " + error, "error", null);
      });
    });
  });

