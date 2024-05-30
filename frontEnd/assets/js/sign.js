document.addEventListener('DOMContentLoaded', function() {
    initializeSignIn();
    initializeSignUp();
    myAccountlink();
});


function initializeSignIn() {
    let email, password;
    var inputEmail = document.getElementById('login-username');
    inputEmail.addEventListener('input', () => {
        email = inputEmail.value;
    });

    var inputPass = document.getElementById('login-password');
    var errorPassword = document.getElementById('error-password');
    inputPass.addEventListener('input', () => {
        password = inputPass.value;
    });


    const modal = document.getElementById('login-form-popup-actiove'); 
    const logInButton = document.querySelector('.btnLogIn');
    logInButton.addEventListener('click', async(event) => {
        event.preventDefault();

        const url = `http://localhost:5502/api/user/login`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const res = await response.json();
            
            if(response.status === 400){
                
                errorPassword.textContent = res.message;
                errorPassword.style.display = 'inline';
            }else{
                showToast(res.message);
                setTimeout(() => {
                    var bootstrapModal = bootstrap.Modal.getInstance(modal);
                    if(bootstrapModal != null){
                        bootstrapModal.hide();
                        window.location.reload(); // Delay the reload to let the user see the toast

                    }else{
                        window.location.href='my-account.html';
                    }
                }, 1000);
            }
        } catch (error) {
            showToast("Netzwerkfehler oder Server nicht erreichbar");
        }
        
    });
}

function initializeSignUp() {
    let name, email, password, isAdmin, toServer;
    var inputName = document.getElementById('register-name');
    var errorName = document.getElementById('error-name');
    inputName.addEventListener('input', () => {
        name = inputName.value;
    });

    var inputEmail = document.getElementById('register-email');
    var errorEmail = document.getElementById('error-email');
    inputEmail.addEventListener('input', () => {
        email = inputEmail.value;
    });

    var inputPass = document.getElementById('register-password');
    var errorPassword = document.getElementById('error-pass');
    inputPass.addEventListener('input', () => {
        password = inputPass.value;
    });

    var isAdminCheck = document.getElementById('admin-select');
    isAdminCheck.addEventListener('change', ()=>{
        toServer = isAdminCheck.value;
    });


    
    const signUpButton = document.querySelector('.btnSignUp');
    const modal = document.getElementById('login-form-popup-actiove'); 

    
    signUpButton.addEventListener('click', async (event) => {
        event.preventDefault(); 
        if(toServer === 'Ja'){
            isAdmin = true;
        }else{
            isAdmin = false;
        }
        const url = `http://localhost:5502/api/user`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, isAdmin }),
            });
            const res = await response.json();
             
           if (response.status === 409) {

                errorEmail.textContent = res.message;
                errorEmail.style.display = 'inline'

            } else if (response.status === 201) {

                showToast(res.message);
                var bootstrapModal = bootstrap.Modal.getInstance(modal); 
                bootstrapModal.hide(); 

            } else if (response.status === 400) {

                errorPassword.textContent = res.message;
                errorPassword.style.display = 'inline'; 
            }
        } catch (error) {
            showToast("Netzwerkfehler oder Server nicht erreichbar");
        }
    });
}

async function myAccountlink(){
    const response = await fetch(`http://localhost:5502/api/user/auth/status`);
    const data = await response.json();
    const myAccount = document.getElementById('myAccountLink');
    myAccount.addEventListener('click', () =>{
        if (data.isAuthenticated) {
            window.location.href= 'my-account.html';
         }else{
             window.location.href='login-register.html';
         }
    });
    
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message; 
    toast.className = 'toast show';

    
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000); // 3s
}
