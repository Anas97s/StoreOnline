/**
 * Cart localy
*/
const addToCartButton = document.querySelector('.addCartBtn');
if (addToCartButton != null) {
    addToCartButton.addEventListener('click', function () {
        const modal = document.getElementById('product-modal-active');
        if (modal != null) {
            const p_id = modal.querySelector('.product-item-details-id').textContent;
            const quantityInput = document.querySelector('.product-item-quantity-input');
            const quantity = parseInt(quantityInput.value, 10);

            (async () => {
                try {
                    const productInfo = await getProductInfo(p_id);
                    
                    const product = { id: p_id, quantity: quantity };
                    let cart = getCart();
                    let item = cart.find(item => item.id === p_id);

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
                            showToast(`You can't add this quantity of product, its more than avaliabe!  you already have ${item.quantity} in your cart!`);
                        }
                    }

                } catch (error) {
                    console.error('Failed to fetch product info:', error);
                }
            })();
        }
    });
}


function addToCart(product) {
    let cart = getCart();
    let foundIndex = cart.findIndex(item => item.id === product.id);
    if (foundIndex !== -1) {
        // Product already exists in the cart, update the quantity
        cart[foundIndex].quantity += parseInt(product.quantity, 10);
    } else {
        // Product does not exist in the cart, add it to the cart
        cart.push({ ...product, quantity: parseInt(product.quantity, 10) }); 
    }
    saveCart(cart);
    updateCartCount();
    updateCartDisplay();
    updateSubtotal();
}


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

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay(); // This will render the cart items based on local storage
    updateSubtotal(); // Update subtotal when the page loads
});

function createCartCard(id, name, price, quantity) {
    const cartContainer = document.querySelector('.cart-product');
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-product-item');
    cartItem.innerHTML = `
    <a href="product-details.html?id=${id}&name=${name}" class="cart-product-thum">
            <img src="assets/images/products/product-1.jpg" alt="Product Cart One">
        </a>
        <div class="cart-product-content">
            <h6 class="cart-product-content-title">
                <a href="product-details.html?id=${id}&name=${name}">${name}</a>
            </h6>
            <div class="cart-product-content-bottom">
                <span class="cart-product-content-quantity">${quantity} × </span>
                <span class="cart-product-content-amount">
                    <bdi>
                        <span class="visually-hidden">Price:</span>
                        ${price}
                    </bdi>
                </span>
            </div>
        </div>
        <button class="cart-product-close" onclick="removeCartItem(this)">×</button>
    `;
    cartContainer.appendChild(cartItem);
}

async function calculateSubtotal() {
    const cart = getCart();  
    let subtotal = 0;

    try {
        for (const item of cart) {
            let productInfo = await getProductInfo(item.id);
            subtotal += productInfo.price * item.quantity;
        }
        return subtotal;
    } catch (error) {
        console.error('Failed to fetch product info:', error);
        return 0;  
    }
}

function getCart() {
    // Retrieve cart data from localStorage
    const cartData = localStorage.getItem('cart');

    // Check if cartData is null or not a string
    if (!cartData || typeof cartData !== 'string') {
        // If cartData is null or not a string, return an empty array
        return [];
    }

    try {
        // Parse the cartData string into an array
        const cartArray = JSON.parse(cartData);

        // Check if cartArray is an array
        if (!Array.isArray(cartArray)) {
            // If cartArray is not an array, return an empty array
            return [];
        }

        // Return the parsed cartArray
        return cartArray;
    } catch (error) {
        console.error('Error parsing cart data:', error);
        // If an error occurs during parsing, return an empty array
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

async function removeCartItem(button) {
    const productElement = button.closest('.cart-product-item');
    
    // Extract the id from the URL in the link
    const url = productElement.querySelector('.cart-product-thum').getAttribute('href');
    const params = new URLSearchParams(url.split('?')[1]);
    const productId = params.get('id');

    
    let cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);

    
    productElement.remove();

   
    updateCartCount();
    updateCartDisplay(); 
    await updateSubtotal();
}

async function updateSubtotal() {
    const subtotalAmountElement = document.querySelector('.mini-cart-amount bdi');

    try {
        // Calculate the subtotal and wait for the promise to resolve
        const subtotal = await calculateSubtotal();
        subtotalAmountElement.textContent = `${subtotal.toFixed(2)} €`;
        return subtotal;  
    } catch (error) {
        console.error('Error updating subtotal:', error);
        
        return 0;  
    }
}

function updateCartDisplay() {
    const cart = getCart();
    const cartContainer = document.querySelector('.cart-product');
    if(cartContainer !== null){
        cartContainer.innerHTML = ''; // Clear existing entries
    }

    cart.forEach(item => {
        (async () => {
            try {
                // Fetch product information using the ID
                const productInfo = await getProductInfo(item.id); 
        
                if (Object.keys(productInfo).length === 0) {
                    console.log("No product found with ID:", item.id);
                    return;  
                }
                createCartCard(item.id, productInfo.name, productInfo.price, item.quantity);
            } catch (error) {
                console.error('Failed to fetch product info:', error);
            }
        })();
    });
}
function updateCartCount() {
    const cart = getCart();
    let totalCount = 0;
    for (const item of cart) {
        totalCount += item.quantity;
    }
    const countElement = document.querySelector('.header-action-item-count-cart');
    if(countElement != null){
        countElement.textContent = totalCount;
    }
}


function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message; // Set the text of the toast
    toast.className = 'toast show'; // Make the toast visible

    // After 3 seconds, hide the toast
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000); // 3000ms = 3s
}