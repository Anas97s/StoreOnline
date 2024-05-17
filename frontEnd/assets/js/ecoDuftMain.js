document.addEventListener('DOMContentLoaded', async function() {
    init();

});

async function init(){
    try {
        const response = await fetch(`http://localhost:5502/api/user/auth/admin/status`);
        const data = await response.json();
        myAccountlink();
        //Only Admin!
        if(data.isAuthenticated && data.isAdmin && t){
            checkAdmin = true;
            //add new prodcut
            addNewProdcut();
            //edit exisit product
            editExsistProduct();
        }else{
            window.location.href="index.html";
        }

    } catch (error) {
        console.log(error);
    }
}


async function addNewProdcut(){
    let name, price, old_price, details, rest, genre;
    
    var parfumName = document.getElementById('duft-name');
    parfumName.addEventListener('input', ()=>{
        name = parfumName.value;
    });

    var parfumPrice = document.getElementById('duft-price');
    parfumPrice.addEventListener('input', ()=>{
        price = parfumPrice.value;
    });

    var parfumOldPrice = document.getElementById('duft-old-price');
    parfumOldPrice.addEventListener('input', ()=>{
        old_price = parfumOldPrice.value;
    });

    var parfumDetails = document.getElementById('duft-details');
    parfumDetails.addEventListener('input', ()=>{
        details = parfumDetails.value;
    });

    var parfumRest = document.getElementById('duft-avaliable');
    parfumRest.addEventListener('input', ()=>{
        rest = parfumRest.value;
    });

    var parfumGenre = document.getElementById('genre-select');
    parfumGenre.addEventListener('change', ()=>{
        genre = parfumGenre.value;
    });

    const createButton = document.querySelector('a.btnLogIn.btn-full.btn-md.btn-primary');
    createButton.addEventListener('click', async()=>{
        try {
            const url = `http://localhost:5502/api/parfums`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, price, old_price, details, rest, genre})
            });
    
            const res = await response.json(); 
            showToast(res.message);
           
        } catch (error) {
           console.log(error); 
        }
    });
}

async function editExsistProduct(){
    document.addEventListener('click', function(event) {
        const editLink = event.target.closest('#editProduct');
        if (editLink) {
            event.preventDefault(); // Prevent default action if necessary
            const dataId = editLink.getAttribute('data-id');
            const dataGenre = editLink.getAttribute('data-genre')
            window.location.href=`productEdit.html?id=${dataId}&genre=${dataGenre}`;
        }
    });
}
