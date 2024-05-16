document.addEventListener('DOMContentLoaded', async () => {
    try {
        
        const response = await fetch(`http://localhost:5502/api/user/auth/status`);
        const data = await response.json();
        const loginLink = document.getElementById('loginLink');
        if (data.isAuthenticated) {
            loginLink.textContent = ''; // Clears the text "Anmelden"
        }

        const profile = document.getElementById('profile');
        if(!data.isAuthenticated){
            profile.textContent = '';
        }

        const wishlist = getWishlist();

        if(wishlist.length > 0){
            for (const item of wishlist) {  
                const productInfo = await getProductInfo(item.id);  
                if (productInfo && Object.keys(productInfo).length > 0) {
                    
                    createProductRow(item.id, productInfo.name, productInfo.price, productInfo.rest);
                } else {
                    console.log("No product info available for ID:", item.id);
                }
            }
        }
    } catch (error) {
        console.error('Failed to fetch product info:', error);
    }
   
});


function createProductRow(id, name, price, available) {
    const tableBody = document.querySelector('.cart-wishlist-table tbody');
    if(tableBody){

        // Create a row element dynamically
        const row = document.createElement('tr');
    
        // Set the HTML content for the row
        row.innerHTML = `
            <td class="remove"><a href="#" class="remove-btn">×</a></td>
            <td class="thumbnail">
                <a href="product-details.html?id=${id}&name=${name}">
                    <img src="assets/images/products/product-1.jpg" alt="cart-product-${id}" width="100" height="100" loading="lazy">
                </a>
            </td>
            <td class="name"> <a href="product-details.html?id=${id}&name=${name}"> ${name} </a></td>
            <td class="price">${price} €</td>
            <td class="stock-status"><span>${available}</span></td>
        `;
    
        // Append the row to the table body
        tableBody.appendChild(row);
        const removeBtn = row.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function(event) {
            event.preventDefault(); 
            row.remove(); // Remove the row from the DOM
            updateWishListAfterRemoval(id); 
        });
    }

}

function updateWishListAfterRemoval(productId){
    const wishlist = JSON.parse(localStorage.getItem('wishlist'));
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
}


document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', function(event) {
        const link = event.target.closest('.product-card-action-link');

        (async () => {
            try {
                if (link) {
                    event.preventDefault();
                    const productId = parseInt(link.dataset.id, 10);

                    // Fetch product information using the ID
                    const productInfo = await getProductInfo(productId); 
                    
                    const productFav = {
                        id: productId,
                        available: productInfo.rest
                    };


                    addToWishlist(productFav);
                    showToast("Du hast " + productInfo.name + " zur Wunschliste hinzugefügt"); 
                }
            } catch (error) {
                console.error('Failed to fetch product info:', error);
            }
        })();

        
    });
});

function addToWishlist(product) {
    let wishlist = getWishlist();
    let foundIndex = wishlist.findIndex(item => item.id == product.id);
    if(foundIndex == -1){
        wishlist.push({ ...product});
    }
    saveWishList(wishlist);
    updateWishListCount();
}

function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
}


function saveWishList(wishlist){
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function updateWishListCount(){
    const wishlist = getWishlist();
    let totalCount = 0;
    for (const item of wishlist){
        totalCount = wishlist.length;
    }
    const countElement = document.querySelector('.header-action-item-count-wishlist');
    if(countElement != null){
        countElement.textContent = totalCount;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateWishListCount();
});



async function getProductInfo(id) {
    try {
        const response = await fetch(`http://localhost:5502/api/parfums/id/${id}`);
        const products = await response.json();  // 'products' might be an array

        // Check if the array is not empty and access the first element
        if (products.length > 0) {
            const product = products[0];
           
            return {
                name: product.name,
                price: product.price,
                old_price: product.old_price,
                details: product.details,
                rest: product.rest
            };
        } else {
            console.log("No products found for ID:", id);
            return {};  // Return an empty object if no products found
        }
    } catch (error) {
        console.error(`Error loading the data for ${id}: `, error);
        return {};
    }
}