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

  async function openIndexedDB(store) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open("auth", 1);
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(store)) {
                        db.createObjectStore(store, { keyPath });
                    }
                };
                request.onsuccess = () => {
                    resolve(request.result);
                };
                request.onerror = () => {
                    reject(request.error);
                };
            });
        }

        async function setItem(store, key, value) {
            const db = await openIndexedDB(store, dbkey);
            return new Promise((resolve, reject) => {
                const tx = db.transaction(store, "readwrite");
                const store = tx.objectStore(store);
                const req = store.put({uid: key, jwt: value});

                req.onsuccess = resolve(true);
                req.onerror = reject(req.error);
            })
        }

        async function getItem(store, key) {
            const db = await openIndexedDB(store);
            return new Promise((resolve, reject) => {
                const tx = db.transaction(store, "readonly");
                const store = tx.objectStore(store);
                const req = store.get(key);

                req.onsuccess = () => {
                  const res = req.result;
                  if(res){
                    resolve(result.serial);
                  } else {
                    resolve(null);
                  }
                };
                req.onerror = reject(req.error)    
            })
            
        }
        

  document.addEventListener("DOMContentLoaded", function() {
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
      const key = await getItem("serial_keys", user.uid);
      const jwt = btoa(crypto.randomUUID());
      const keyRef = db.collection("lisensi").doc(key);
      const usersData = db.collection("users");

      keyRef.get().then(async (Keydoc) => {
        if(Keydoc.exists) {
          usersData.doc(user.uid).get().then(async (userDoc) => {
            if (userDoc.exists || Keydoc.exists) {
              const userData = userDoc.data();
              if (userData.loggedIn == true && userData.serialKey == key) {
                setLog.innerHTML = "Anda sudah masuk sebagai: " + userData.email;
                await setItem("jwt", user.uid, jwt)
                openPopup("Sukses", "Anda sudah masuk sebagai: " + userData.displayName, "success", "https://da5100.github.io/qrda/?session="+jwt)
              } else {
                console.log("User data not found or not logged in.");
              }
            } else {
              console.log("User document does not exist.");
            }
          });
        }else {
          console.log("Serial key document does not exist.");
        }
      })
    });
  });

