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

    document.addEventListener("DOMContentLoaded", async function() {
      auth.onAuthStateChanged(async (user) => {
        const loading = document.getElementById("loading");
        const success = document.getElementById("success");
        const error = document.getElementById("error");

        if (!user) {
          loading.classList.remove("active");
          error.classList.remove("active");
          openPopup("Error", "Anda harus masuk untuk memverifikasi serial key.", "error", "https://da5100.github.io/auth/");
          return;
        }
        if (user) {
          window.onload = async () => {
            loading.classList.add("active");
            success.classList.remove("active"); 
            error.classList.remove("active");
          }
          console.log("User is logged in:", user.displayName);
          const email = String(user.email);
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
                    console.log("User data found:", userData);
                    loading.classList.remove("active");
                    error.classList.add("active");
                    await setItem("jwt", user.uid, jwt)
                    openPopup("Sukses", "Anda sudah masuk sebagai: " + userData.displayName, "success", "https://da5100.github.io/qrda/?session="+jwt)
                  } else {
                    loading.classList.remove("active");
                    error.classList.remove("active");
                    console.log("User data not found or not logged in.");
                  }
                } else {
                  loading.classList.remove("active");
                  error.classList.add("active");
                  console.log("User document does not exist.");
                }
              });
            } else {
              loading.classList.remove("active");
              error.classList.add("active");
              console.log("Serial key document does not exist.");
            }
          })
          }
        else {
          loading.classList.remove("active");
          error.classList.remove("active");
          console.log("No user is logged in.");
        }   
      });
          async function openIndexedDB(store) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("auth", 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(store)) {
                db.createObjectStore(store, { keyPath: "uid" }); // FIXED: added keyPath
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
    const db = await openIndexedDB(store); // FIXED: removed undefined 'dbkey'
    return new Promise((resolve, reject) => {
        const tx = db.transaction(store, "readwrite");
        const objectStore = tx.objectStore(store); // FIXED: renamed to avoid shadowing
        const req = objectStore.put({ uid: key, jwt: value }); // FIXED: matches keyPath

        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
    });
}

async function getItem(store, key) {
    const db = await openIndexedDB(store);
    return new Promise((resolve, reject) => {
        const tx = db.transaction(store, "readonly");
        const objectStore = tx.objectStore(store); // FIXED: renamed to avoid shadowing
        const req = objectStore.get(key);

        req.onsuccess = () => {
            const result = req.result;
            if (result) {
                resolve(result.jwt); // FIXED: 'serial' changed to 'jwt' (matches stored data)
            } else {
                resolve(null);
            }
        };
        req.onerror = () => reject(req.error);
    });
}

    });


