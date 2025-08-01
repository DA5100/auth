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
            
            document.getElementById("tombol").addEventListener('click', () => {
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
        })
        