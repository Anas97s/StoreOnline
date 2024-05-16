document.addEventListener('DOMContentLoaded', async function() {
    await init();
    initializeTabs();
    setupProductQuickView();
});
let checkAdmin = false;

async function init(){
    try {
        const res= await fetch(`http://localhost:5502/api/user/auth/admin/status`);
        const ad = await res.json();

        if(ad.isAuthenticated && ad.isAdmin){
            checkAdmin = true;
            window.location.href = 'ecoDuftMain.html';
        }else{
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
        }
    } catch (error) {
        console.log(error);
    }
}


/**
 * Initialize tab, fetch data for tabs and Create a product Cards
 */
function initializeTabs() {
    const tabLinks = document.querySelectorAll('.product-category-tab-link');
    tabLinks.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(event) {
            const targetId = event.target.getAttribute('data-bs-target').replace('#', '');
            fetchDataForTab(targetId);
        });
    });
    fetchDataForTab('tab-1'); // Fetch data for the default active tab initially
}
function fetchDataForTab(tabId) {
    const categoryMap = {
        'tab-1': 'Men',    
        'tab-2': 'Woman',
        'tab-3': 'Unisex'
    };
    const category = categoryMap[tabId];
    if (!category) {
        console.error(`Unknown category for tab: ${tabId}`);
        return;
    }

    fetch(`http://localhost:5502/api/parfums/genre/${category}`)
        .then(response => response.json())
        .then(parfums => {
            const container = document.querySelector(`#${tabId} .container-shop .row`);
            if(container != null){
                populateData(container, parfums);
            }
        })
        .catch(error => console.error(`Error loading the data for ${category}: `, error));
}
function populateData(container, parfums) {
    container.innerHTML = '';
    parfums.forEach(parfum => {
        container.appendChild(createProductCard(parfum));
    });
}
function createProductCard(parfum) {
    const col = document.createElement('div');
    col.className = 'col';

    // Check if old_price is not null before rendering the Sale label
    const saleLabel = parfum.old_price ? '<span class="product-card-label">Angebot</span>' : '';
    
    let x = '';
    if (checkAdmin) {
        x = `
        <a href="#" class="product-card-action-link"
            data-id="${parfum.id}" data-genre="${parfum.genre}" id="editProduct">
            <i class="fa fa-pencil-square fa-xl" aria-hidden="true"></i> 
        </a>`;
    } else {
        x = `
        <a href="#" class="product-card-action-link" aria-label="wishlist" data-id="${parfum.id}" data-name="${parfum.name}" data-price="${parfum.price}" 
            data-o_p="${parfum.old_price}" data-details="${parfum.details}" data-r="${parfum.rest}">
            <i class="fa-regular fa-heart"></i>
        </a>
        `;
    }

    col.innerHTML = `
    <div class="product-card">
        <div class="product-card-thumb-area">
            <a href="product-details.html?id=${parfum.id}&name=${parfum.name}" class="product-card-thumb">
                <img class="product-card-thumb-primary" src="assets/images/products/product-1.jpg" alt="Product Image primary 1" width="340" height="320">
                ${saleLabel}
            </a>
            <button class="product-card-action-quickview" data-bs-target="#product-modal-active" data-bs-toggle="modal" id="${parfum.id}" data-category="${parfum.genre}">Zum Produkt</button>
            <ul class="product-card-action-links">
                <li class="product-card-action-item">
                    ${x}
                </li>
            </ul>
        </div>
        <div class="product-card-content">
            <h4 class="product-card-title">
                <a href="product-details.html?id=${parfum.id}&name=${parfum.name}">${parfum.name}</a>
            </h4>
            <div class="product-card-price">
                <span class="visually-hidden">Price</span>
                <span class="product-card-regular-price">${parfum.price} €</span>
            </div>
        </div>
    </div>
    `;

    return col;
}


/** 
 * Fetch, display, update product details in Modal
 * */
function setupProductQuickView() {
    const container = document.querySelector('.product-section');
    if(container != null){
        container.addEventListener('click', function(event) {
            if (event.target.classList.contains('product-card-action-quickview')) {
                const productId = event.target.id;
                fetchProductDetails(productId);
            }
        });
    }
}

function fetchProductDetails(productId) {
    fetch(`http://localhost:5502/api/parfums/id/${productId}`)
        .then(response => response.json())
        .then(products => {
            if (products.length > 0) {
                const product = products[0];
                updateModalContent(product.id);
            } else {
                alert('No product found.');
            }
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            alert('Failed to load product details.');
        });
}


function updateModalContent(productID) {
    
    (async () => {
        try {
            
            // Fetch product information using the ID
            const productInfo = await getProductInfo(productID);
            
            // Directly access elements within the existing modal
            const modal = document.getElementById('product-modal-active');
            modal.querySelector('.product-item-details-id').textContent = productID;
            modal.querySelector('.product-item-details-title').textContent = productInfo.name;
            modal.querySelector('.product-card-old-price').textContent = productInfo.old_price ? `${productInfo.old_price}` : "";
            modal.querySelector('.product-card-regular-price').textContent = `${productInfo.price} €`;
            modal.querySelector('.product-item-details-description').textContent = productInfo.details || "No description available.";
            modal.querySelector('.stock-label').textContent = "Verfügbar:";
            modal.querySelector('.product-item-stock-in').textContent = productInfo.rest;
            modal.querySelector('.swiper-slide img').src = 'assets/images/large-products/large-product-01.jpg';
            //modal.querySelector('.swiper-slide img').alt = `Image of ${product.name}`; 
            setupQuantityControls(productInfo.rest); 
    
        } catch (error) {
            console.error('Failed to fetch product info:', error);
        }
    })();
}


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




