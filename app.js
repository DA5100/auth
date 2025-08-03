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
        const app = firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const provider = new firebase.auth.GoogleAuthProvider();
        document.addEventListener("DOMContentLoaded", function(){
            auth.onAuthStateChanged(async (user) => {
                if(!user){
                    document.getElementById("main-container").innerHTML = `
                        <div class="login-container">
                            <div class="login-box">
                            <img src="https://ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="Avatar" class="avatar">
                            <h2>Sign in with Google Account</h2>
                            <p>to access the media.</p>
                            
                            <button id="sign-in-btn">Login</button>
                            </div>
                        </div>
                    `
                    document.getElementById("dynamic").innerText = `
                        * {
                        box-sizing: border-box;
                        }

                        body {
                        margin: 0;
                        font-family: 'Roboto', sans-serif;
                        background: #f2f2f2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        }

                        .login-container {
                        width: 100%;
                        max-width: 400px;
                        padding: 40px;
                        background: white;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        border-radius: 8px;
                        text-align: center;
                        }

                        .login-box .avatar {
                        width: 72px;
                        height: 72px;
                        margin-bottom: 10px;
                        }

                        .login-box h2 {
                        margin: 10px 0 5px;
                        font-size: 24px;
                        font-weight: 400;
                        }

                        .login-box p {
                        margin: 0 0 20px;
                        color: #666;
                        }

                        button {
                        width: 100%;
                        padding: 12px;
                        margin-top: 20px;
                        background-color: #1a73e8;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        font-size: 16px;
                        cursor: pointer;
                        }

                        button:hover {
                        background-color: #1669c1;
                        }

                    `
                document.getElementById("sign-in-btn").addEventListener("click", async () => {
                    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                    .then(() => {
                        return auth.signInWithPopup(provider);
                    })
                    .then((result) => {
                        const user = result.user;
                        console.log("User signed in:", user.displayName);
                        openPopup("Sukses", "Welcome, " + user.displayName, "success", `https://da5100.github.io/auth/serial/`);
                    })
                    .catch((error) => {
                        console.error('Error signing in with Google:', error);
                        openPopup("Error", "Gagal masuk dengan Google: " + error, "error", null);
                    }); 
                });
                
                } else {
                    document.getElementById("main-container").innerHTML = `
                       <div class="serial-container">
                        <h2>Enter Your License Key</h2>
                        <input
                        id="input-serial"
                        type="text"
                        class="serial-key"
                        placeholder="XXXXX-XXXXX"
                        maxlength="11"
                        autocomplete="off"
                        spellcheck="false"
                        required
                        />
                        <button id="serial-key-btn">Activate</button>
                    </div>

                    
                    `;
                    document.getElementById("dynamic").innerText = `    
                        body {
                        background: #f2f2f2;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        height: 100vh;
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        }

                        .serial-container {
                        background: white;
                        padding: 30px 40px;
                        border-radius: 8px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        text-align: center;
                        width: 320px;
                        }

                        h2 {
                        margin-bottom: 24px;
                        font-weight: 600;
                        color: #333;
                        }

                        input.serial-key {
                        width: 100%;
                        padding: 12px 16px;
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 20px;
                        letter-spacing: 0.3em;
                        border: 2px solid #ccc;
                        border-radius: 6px;
                        outline: none;
                        text-transform: uppercase;
                        transition: border-color 0.3s ease;
                        box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
                        background-color: #fff;
                        caret-color: #1a73e8;
                        }

                        input.serial-key::placeholder {
                        letter-spacing: normal;
                        color: #aaa;
                        }

                        input.serial-key:focus {
                        border-color: #1a73e8;
                        box-shadow: 0 0 6px rgba(26,115,232,0.6);
                        }

                        button {
                        margin-top: 24px;
                        width: 100%;
                        padding: 14px;
                        font-size: 16px;
                        font-weight: 600;
                        background-color: #1a73e8;
                        border: none;
                        border-radius: 6px;
                        color: white;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                        }

                        button:hover {
                        background-color: #1669c1;
                        }`
                }
                
            });
            
        });

        async function openIndexedDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open("auth", 1);
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains("serial_keys")) {
                        db.createObjectStore("serial_keys", { keyPath: "uid" });
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

        async function setItem(key, value) {
            const db = await openIndexedDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction("serial_keys", "readwrite");
                const store = tx.objectStore("serial_keys");
                const req = store.put({uid: key, serial: value});

                req.onsuccess = resolve(true);
                req.onerror = reject(req.error);
            })
        }

        async function getItem(key) {
            const db = await openIndexedDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction("serial_keys", "readonly");
                const store = tx.objectStore("serial_keys");
                const req = store.get(key);

                req.onsuccess = resolve(req.result);
                req.onerror = reject(req.error)    
            })
            
        }
        

        function getSerialkey() {
            const raw = document.querySelector('.serial-key').value;
            const serial = raw.replace(/-/g, '').toUpperCase();
            

            if (serial.length !== 10) { 
                openPopup("Error", "Serial key must be 10 characters long.", "error", null);
                return;
            } else {
            auth.onAuthStateChanged(async (user) => {
                const email = String(user.email);
                const keyRef = db.collection("lisensi").doc(serial);
                const usersData = db.collection("users")
                const emailmd5 = CryptoJS.MD5(email).toString();

                keyRef.get().then((doc) => {
                const keyData = doc.data();

                    if (!doc.exists) {
                    
                    openPopup("Error", "Serial key tidak ditemukan.", "error", null);
                    return;
                    } 
                    
                    if (keyData.used == true && keyData.email !== email) {
                    
                    openPopup("Error", "Serial key sudah digunakan", "error", null);
                    return;
                    } else if (keyData.used == true && keyData.email == email) {
                        
                        openPopup("Sukses", "Email & Serial key berhasil diverifikasi.", "success", "https://da5100.github.io/qrda/verifikasi");
                    } else if (keyData.blocked == true) {
                       
                        openPopup("Error", "Serial key ini diblokir.", "error", null);
                        return;
                    } 
                    else if (keyData.email && keyData.email !== email) {
                        openPopup("Error", "Serial key ini tidak cocok dengan akun Anda.", "error", null);
                        return;
                    } else { 
                    usersData.doc(user.uid).set({
                        loggedIn: true,
                        serialKey: serial,
                    }).then(() => {
                        setItem(user.uid, serial)
                        console.log("User data updated successfully.");
                        keyRef.update({
                            used: true,
                            email: email,
                            }).then(() => {
                                openPopup("Sukses", "Serial key berhasil diverifikasi.", "success", "https://da5100.github.io/qrda/verifikasi");
                            }).catch((error) => {
                                console.error("Gagal memperbarui status serial key:", error);
                                openPopup("Error", "Gagal memperbarui status serial key: " + error, "error", null);
                            });
                            }).catch((error) => {
                                console.error("Gagal memperbarui data pengguna:", error);
                                openPopup("Error", "Gagal memperbarui data pengguna: " + error, "error", null);
                            }).catch((error) => {
                                console.error("Gagal mencari data pengguna: " + error );
                            }); 
                    }
                }).catch((error) => {
                    console.error("Gagal cek serial key:", error);
                    alert("Gagal verifikasi serial key.");
                    openPopup("Error", "Gagal verifikasi serial key: " + error, "error", null);
                });
            });
        }
    }
    function formatKey(input) {
 let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    value = value.substring(0, 10); // max 10 chars

      if (value.length > 5) {
                            value = value.substring(0, 5) + '-' + value.substring(5);
                        }

                        input.value = value;
                        }

document.addEventListener("DOMContentLoaded", () => {
    const inputelement =  document.getElementById("input-serial");
    if (inputelement){
    inputelement.addEventListener("input", function () {
        formatKey(this);
     });
    }
    const btn = ocument.getElementById("serial-key-btn");
    if (btn) {
        document.getElementById("serial-key-btn").addEventListener("click", getSerialkey);
    }
 
  
});

       