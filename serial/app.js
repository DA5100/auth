
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
        alert("Anda belum login. Silakan login terlebih dahulu.");
        window.location.href = "https://da5100.github.io/auth/";
        return;
      }
      if (user) {
        console.log("User is logged in:", user.displayName); 
      }
      const email = String(user.email);
      const keyRef = db.collection("lisensi").doc(sK);
      const md5serialKey = CryptoJS.MD5(sK).toString();
      const md5email = CryptoJS.MD5(email).toString();

      keyRef.get().then((doc) => {
        if (!doc.exists) {
          alert("Serial key tidak ditemukan.");
          auth.signOut();
          return;
        }
        const keyData = doc.data();
        if (keyData.used == true && keyData.email !== email) {
          alert("Maaf, Serial key ini sudah digunakan.");
          auth.signOut();
          return;
        } else if (keyData.used == true && keyData.email == email) {
            alert("Email dan serial key sudah terverifikasi.");
            sessionStorage.setItem("serial_key", md5serialKey);
            sessionStorage.setItem("email", md5email);
            window.location.href = "https://da5100.github.io/qrda/?session=" + md5serialKey + "&email=" + md5email;
           
        } else if (keyData.blocked == true) {
            alert("Maaf, Serial key ini diblokir.");
            auth.signOut();
            return;
        } 
        else if (keyData.email && keyData.email !== email) {
            alert("Maaf, Serial key ini tidak cocok dengan akun Anda.");
            auth.signOut();
            return;
        } else { 
        keyRef.update({
          used: true,
          email: email,
          }).then(() => {
            alert("Serial key berhasil diverifikasi.");
            sessionStorage.setItem("serial_key", md5serialKey);
            sessionStorage.setItem("email", md5email);
            window.location.href = "https://da5100.github.io/qrda/?session=" + md5serialKey + "&email=" + md5email;
          }).catch((error) => {
            console.error("Gagal memperbarui status serial key:", error);
            alert("Gagal memperbarui status serial key.");
          });
        }
      }).catch((error) => {
        console.error("Gagal cek serial key:", error);
        alert("Gagal verifikasi serial key.");
      });
    });
  });

