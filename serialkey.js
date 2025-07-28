const user = firebase.auth().currentUser;
const inputKey = prompt("Masukkan Serial Key:");

const db = firebase.firestore();
const keyRef = db.collection("lisensi").doc(lisensi);

keyRef.get().then((doc) => {
  if (!doc.exists) {
    alert("Serial key tidak ditemukan.");
    auth.signOut();
    return;
  }

  const keyData = doc.data();

  if (keyData.used) {
    alert("Serial key ini sudah digunakan.");
    auth.signOut();
    return;
  }

  if (keyData.blocked) {
    alert("Serial key ini diblokir.");
    auth.signOut();
    return;
  }

  // Simpan data user ke Firestore
  const userRef = db.collection("users").doc(user.uid);

  userRef.set({
    email: user.email,
    name: user.displayName || "Anonymous",
    serialKey: inputKey,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    // Tandai serial key sudah digunakan
    keyRef.update({
      used: true,
      userId: user.uid,
      usedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Registrasi berhasil!");
    // Lanjut ke dashboard atau update UI
    updateUI(user);
  }).catch((error) => {
    console.error("Gagal menyimpan user:", error);
    alert("Terjadi kesalahan saat menyimpan data.");
  });

}).catch((error) => {
  console.error("Gagal cek serial key:", error);
  alert("Gagal verifikasi serial key.");
});
