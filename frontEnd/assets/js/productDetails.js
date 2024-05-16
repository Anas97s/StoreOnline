document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    (async () => {
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

            
            // Fetch product information using the ID
            const productInfo = await getProductInfo(productId); 
    
            if (Object.keys(productInfo).length === 0) {
                console.log("No product found with ID:", productId);
                return;  
            }
            
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
            
    
        } catch (error) {
            console.error('Failed to fetch product info:', error);
        }
    })();
    
    
    const addToCartButton = document.querySelector('.addCartBtn');
    if(addToCartButton != null){
        
        addToCartButton.addEventListener('click', function() {
            const quantityInput = document.querySelector('.product-item-quantity-input');
            const quantity = quantityInput.value;
    
            (async () => {
                try {
                    // Fetch product information using the ID
                    const productInfo = await getProductInfo(productId); 
            
                    const product = {
                        id: productId,
                        quantity: quantity
                    };

                    let cart = getCart();
                    let item = cart.find(item => item.id === productId);
                    
                    if(cart.length == 0){
                        if(product.quantity <= productInfo.rest){
                            addToCart(product);
                        }
                    }else{
                        let choosenQuantity = 0;
                        
                        if(item != null){
                            choosenQuantity = parseInt(quantity) + item.quantity;
                        }
                        
                        if(choosenQuantity <= productInfo.rest){
                            addToCart(product);
                        }else{
                            showToast(`Du kannst diese Produktmenge nicht hinzufügen, es ist mehr als verfügbar! du hast bereits ${item.quantity} vom gleichen Produkt in deinem Warenkorb!`);
                        }
                    }
            
                } catch (error) {
                    console.error('Failed to fetch product info:', error);
                }
            })();
    
        });
    }

    const addToWishlistButton = document.querySelector('.product-item-wishlist-action');
    addToWishlistButton.addEventListener('click', function(){
        (async () => {
            try {
                // Fetch product information using the ID
                const productInfo = await getProductInfo(productId); 
                
                const productFav = {
                    id: productId,
                    name: productInfo.name,
                    price: productInfo.price,
                    available: productInfo.rest
                };

                addToWishlist(productFav);
            } catch (error) {
                console.error('Failed to fetch product info:', error);
            }
        })();
        
    });


    (async () => {
        try {
            // Fetch product information using the ID
            const productInfo = await getProductInfo(productId); 
            setupQuantityControls(productInfo.rest);
        } catch (error) {
            console.error('Failed to fetch product info:', error);
        }
    })();

});

let decrementHandler = null;
let incrementHandler = null;
function setupQuantityControls(maxAmount) {
    const quantityInput = document.querySelector('.product-item-quantity-input');
    const decrementButton = document.querySelector('.product-item-quantity-decrement');
    const incrementButton = document.querySelector('.product-item-quantity-increment');

    // Clean up previous event listeners
    if (decrementHandler) {
        decrementButton.removeEventListener('click', decrementHandler);
    }
    if (incrementHandler) {
        incrementButton.removeEventListener('click', incrementHandler);
    }

    // Create new handlers
    decrementHandler = function() {
        let currentValue = parseInt(quantityInput.value, 10);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    };

    incrementHandler = function() {
        let currentValue = parseInt(quantityInput.value, 10);
        if (currentValue < maxAmount) {
            quantityInput.value = currentValue + 1;
        }
    };

    // Attach the event handlers
    decrementButton.addEventListener('click', decrementHandler);
    incrementButton.addEventListener('click', incrementHandler);

    // Reset the quantity input to 1 each time the modal content is updated
    quantityInput.value = 1;
}



