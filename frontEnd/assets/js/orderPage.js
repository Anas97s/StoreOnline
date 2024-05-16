document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    getOrder(productId);
});


function createOrderRow(id, name, price, quantity) {
    const tableBody = document.querySelector('.cart-wishlist-table tbody');
    
    // Create a row element dynamically
    const row = document.createElement('tr');

    // Set the HTML content for the row
    row.innerHTML = `
        <td class="remove"><a href="#" class="remove-btn"></a></td>
        <td class="thumbnail">
            <a href="product-details.html?id=${id}&name=${name}">
                <img src="assets/images/products/product-1.jpg" alt="cart-product-${id}" width="100" height="100" loading="lazy">
            </a>
        </td>
        <td class="name"> <a href="product-details.html?id=${id}&name=${name}">${name}</a></td>
        <td class="price"> <a href="product-details.html?id=${id}&name=${name}">${price} €</a></td>
        <td class="quantity">
            ${quantity}  
        </td>
    `;
    // Append the row to the table body
    tableBody.appendChild(row);
}


async function getOrder(id){
    const url = `http://localhost:5502/api/orders/order/${id}`;
    const response = await fetch(url, {
        method: "GET"
    });
    const {o_tc, o_i} = await response.json();
    for (const item of o_i) {
        let parfum = await getParfumDetails(item.parfum_id);
        createOrderRow(item.parfum_id, parfum.name, parfum.price, item.quantity);
    }
    const orderToal = document.querySelector('td.order-total-amount');
    orderToal.textContent = o_tc + '€';
}

async function getParfumDetails(id){
    const url = `http://localhost:5502/api/parfums/id/${id}`;
    const response = await fetch(url, {
        method: "GET"
    });
    const res = await response.json();
    return{
        name: res[0].name,
        price: res[0].price
    }
}