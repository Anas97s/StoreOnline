document.addEventListener("DOMContentLoaded", async function() {
    init();
    
});

async function init(){
    const response = await fetch(`http://localhost:5502/api/user/auth/admin/status`);
    const data = await response.json();
    myAccountlink();
    //Only Admin!
    if(data.isAuthenticated && data.isAdmin){
        checkAdmin = true;
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const genre = urlParams.get('genre');
        let name, price, old_price, rest, details;

        try {
            // Fetch product information using the ID
            const productInfo = await getProductInfo(productId); 
            if (Object.keys(productInfo).length === 0) {
                console.log("No product found with ID:", productId);
                return;  
            }
            name = productInfo.name;
            price = productInfo.price;
            old_price = productId.old_price;
            rest = productInfo.rest;
            details = productInfo.details;

            document.querySelector('.product-item-details-title').textContent = productInfo.name;
            document.querySelector('.product-item-details-id').textContent = productId;
            document.querySelector('.product-card-regular-price').textContent = productInfo.price + " €";
            if(productInfo.old_price == null){
                document.querySelector('.product-card-old-price').textContent = "";
            }else{
                document.querySelector('.product-card-old-price').textContent = `${productInfo.old_price}`;
            }
            document.querySelector('.stock-label').textContent = "Verfügbar: "
            document.querySelector('.product-item-stock-in').textContent = productInfo.rest;
            if(productInfo.details == null){
                document.querySelector('.product-item-details-description').textContent = "No description available.";
            }else{
                document.querySelector('.product-item-details-description').textContent = productInfo.details;
            }

            saveChanges(productId, name, genre, price, old_price, rest, details);
            deleteProduct(productId);
        } catch (error) {
            console.error('Failed to fetch product info:', error);
        }
    }else{
        window.location.href="index.html";
    }
   
}


async function saveChanges(id, name_, genre, price_, old_price_, rest_, details_){
    let name, price, old_price, rest, details;

    var inputName = document.getElementById('duft-name-edit');
    inputName.addEventListener('input', ()=>{
        name = inputName.value;
        if(!name || name.trim() === ''){
            name = name_;
        }
    });

    var inputPrice = document.getElementById('duft-price-edit');
    inputPrice.addEventListener('input', ()=>{
        price = inputPrice.value;
        if(!price || price.trim() === ''){
            price = price_;
        }
    });

    var inputOldPrice = document.getElementById('duft-old-price-edit');
    inputOldPrice.addEventListener('input', ()=>{
        old_price = inputOldPrice.value;
        if(!old_price || old_price.trim() === ''){
            old_price = old_price_;
        }
    });

    var inputRest = document.getElementById('duft-avaliable-edit');
    inputRest.addEventListener('input', ()=>{
        rest = inputRest.value;
        if(!rest || rest.trim() === ''){
            rest = rest_;
        }
    });

    var inputDetails = document.getElementById('duft-details-edit');
    inputDetails.addEventListener('input', ()=>{
        details = inputDetails.value;
        if(!details || details.trim() === ''){
            details = details_;
        }
    });


    const saveButton = document.querySelector('button.addCartBtn.btn-primary.btn-lg');
    saveButton.addEventListener('click', async()=>{
        try {
            const url = `http://localhost:5502/api/parfums/${id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name, genre, price, old_price, rest, details})
            });

            const res = await response.json();
            showToast(res.message);
        } catch (error) {
            console.log(error);
        }
    });
}

async function deleteProduct(id){
    const deleteButton = document.getElementById('deleteProduct');
    deleteButton.addEventListener('click', async ()=>{
        try {
            const url = `http://localhost:5502/api/parfums/${id}`;
            const response = await fetch(url, {
                method: "DELETE"
            });

            const res = await response.json();
            showToast(res.message);
            setTimeout(() => {
                window.location.href='index.html';
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    })
}