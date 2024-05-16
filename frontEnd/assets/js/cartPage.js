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

        
        const cart = getCart();
        
        for (const item of cart) {  
            const productInfo = await getProductInfo(item.id);  
            if (productInfo && Object.keys(productInfo).length > 0) {
                
                createCartCard(item.id, productInfo.name, productInfo.price, item.quantity);
                createOrderRow(item.id, productInfo.name, productInfo.price, item.quantity, productInfo.rest);
            } else {
                console.log("No product info available for ID:", item.id);
            }
        }

        const checkOutButton = document.querySelector('.btn.btn-dark');
        checkOutButton.addEventListener('click', () =>{
            checkOutButton.href = "checkout.html";
        });
    } catch (error) {
        console.error('Failed to fetch product info:', error);
    }
   
    setupQuantityControls();
    showTotal();
    
 
});


async function formatCartData(cart) {
    // Ensure that cart is always an array
    if (!Array.isArray(cart)) {
        console.error('Cart is not an array:', cart);
        // Wrap the non-array cart value in an array and return
        return [cart];
    }

    try {
        // Fetch product information for each item in the cart
        const updatedCart = await Promise.all(cart.map(async (item) => {
            const productInfo = await getProductInfo(item.id);
            if (productInfo) {
                return {
                    id: item.id,
                    quantity: item.quantity,
                    name: productInfo.name,
                    price: productInfo.price
                };
            } else {
                // Handle case where product info is not available
                console.error("Product info not found for ID:", item.id);
                return null; // Or handle differently as per your requirement
            }
        }));
        return updatedCart.filter(item => item !== null); // Filter out null items
    } catch (error) {
        console.error('Failed to fetch product info:', error);
        return cart; // Return the original cart if an error occurs
    }
}
function showTotal() {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = getCart();
            let total = 0;
            
            for (const item of cart) {
                const productInfo = await getProductInfo(item.id);
                total += productInfo.price * item.quantity;
            }
            
            document.querySelector('.order-total-amount').textContent = total.toFixed(2) + " €";
            resolve(total);
        } catch (error) {
            console.error('Failed to fetch product info:', error);
            reject(error);
        }
    });
}
let decrementHandler = null;
let incrementHandler = null;
function setupQuantityControls() {
    const quantityInputs = document.querySelectorAll('.product-item-quantity-input');
    quantityInputs.forEach(input => {
        const decrementButton = input.closest('.product-item-quantity').querySelector('.product-item-quantity-decrement');
        const incrementButton = input.closest('.product-item-quantity').querySelector('.product-item-quantity-increment');

        // Clean up previous event listeners if they exist
        decrementButton.removeEventListener('click', decrementButton.handler);
        incrementButton.removeEventListener('click', incrementButton.handler);

        // Create new handlers
        decrementButton.handler = function() {
            let currentValue = parseInt(input.value, 10);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateCart();
            }
        };
        incrementButton.handler = function() {
            let currentValue = parseInt(input.value, 10);
            let maxAvailable = parseInt(input.dataset.available, 10);
            if (currentValue < maxAvailable) {
                input.value = currentValue + 1;
                updateCart();
            }
        };

        // Attach the event handlers
        decrementButton.addEventListener('click', decrementButton.handler);
        incrementButton.addEventListener('click', incrementButton.handler);
    });
}

function createOrderRow(id, name, price, quantity, available) {
    const tableBody = document.querySelector('.cart-wishlist-table tbody');
    
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
        <td class="name"> <a href="product-details.html?id=${id}&name=${name}">${name}</a></td>
        <td class="price"> <a href="product-details.html?id=${id}&name=${name}">${price} €</a></td>
        <td class="quantity">
            <div class="product-item-quantity">
                <button class="product-item-quantity-decrement product-item-quantity-button" type="button">-</button>
                <input type="text" class="product-item-quantity-input" data-id="${id}" value="${quantity}" data-available="${available}">
                <button class="product-item-quantity-increment product-item-quantity-button" type="button">+</button>
            </div>
        </td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);

    const removeBtn = row.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function(event) {
        event.preventDefault(); 
        row.remove(); // Remove the row from the DOM
        updateCartAfterRemoval(id); 
    });
}
function updateCartAfterRemoval(productId) {
    const cart = getCart()
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
   
    calculateSubtotal();
    updateSubtotal();
    showTotal();
}
function updateCart() {
    const quantityInputs = document.querySelectorAll('.product-item-quantity-input');
    const cart = getCart();

    quantityInputs.forEach(input => {
        const productId = input.dataset.id; // String ID is fine unless you need numeric comparison.
        const newQuantity = parseInt(input.value, 10);
        const item = cart.find(item => item.id === productId);

        if (item) {
            item.quantity = newQuantity; // Update the item quantity in the cart array
        }
    });

    localStorage.setItem('cart', JSON.stringify(cart)); // Save the updated cart back to local storage
    updateCartDisplay(); 
    updateSubtotal(); 
    showTotal(); 
}





