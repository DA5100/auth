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

  document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const sK = params.get("serial_key");
    auth.onAuthStateChanged((user) => {
      if (!user) {
        openPopup("Error", "Anda harus masuk untuk memverifikasi serial key.", "error", "https://da5100.github.io/auth/");
        return;
      }
      if (user) {
        console.log("User is logged in:", user.displayName);
      }
      const email = String(user.email);
      const setLog = document.getElementById("status-log");
      const rawKey = sK.trim().replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      const keyRef = db.collection("lisensi").doc(rawKey);
      const emailmd5 = CryptoJS.MD5(email).toString();

      keyRef.get().then((doc) => {
        if (!doc.exists) {
          setLog.textContent = "Serial key tidak ditemukan: " + rawKey;
          openPopup("Error", "Serial key tidak ditemukan.", "error", "https://da5100.github.io/auth/serial/");
          return;
        } 
        const keyData = doc.data();
        if (keyData.used == true && keyData.email !== email) {
          setLog.textContent = "Serial key sudah digunakan: " + rawKey;
          openPopup("Error", "Serial key sudah digunakan", "error", "https://da5100.github.io/auth/serial/");
          return;
        } else if (keyData.used == true && keyData.email == email) {
            setLog.textContent = "Email & Serial key berhasil diverifikasi: " + rawKey;
            openPopup("Sukses", "Email & Serial key berhasil diverifikasi.", "success", "https://da5100.github.io/qrda/?session=" + emailmd5 + "&serial_key=" + rawKey);
            return;
        } else if (keyData.blocked == true) {
            setLog.textContent = "Serial key ini diblokir: " + rawKey;
            openPopup("Error", "Serial key ini diblokir.", "error", "https://da5100.github.io/auth/serial/");
            return;
        } 
        else if (keyData.email && keyData.email !== email) {
            setLog.textContent = "Serial key ini tidak cocok dengan akun Anda: " + rawKey;
            openPopup("Error", "Serial key ini tidak cocok dengan akun Anda.", "error", "https://da5100.github.io/auth/serial/");
            return;
        } else { 
        keyRef.update({
          used: true,
          email: email,
          }).then(() => {
            setLog.textContent = "Serial key berhasil diverifikasi: " + rawKey;
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

