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
            auth.signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;
                    console.log("User signed in:", user.displayName);
                    alert(`Welcome ${user.displayName}`);
                })
                .catch((error) => {
                    console.error('Error signing in with Google:', error);
                    alert('Error signing in with Google. Please try again.');
                });
            });
            signOutBtn.addEventListener('click', () => {
                auth.signOut()
                    .then(() => {
                        authContainer.classList.remove('hidden');
                        userInfo.classList.add('hidden');
                    })
                    .catch((error) => {
                       console.error('Error signing out:', error);
                 });
        });
        })
        