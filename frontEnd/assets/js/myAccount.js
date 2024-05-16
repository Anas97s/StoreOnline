document.addEventListener('DOMContentLoaded', async () => {
    try {
        init();
        getAllOrders();
        logOut();
    } catch (error) {
        console.error('Failed to create product row:', error);
    }
});

async function init(){
    const url = "http://localhost:5502/api/user/me";
    const response = await fetch(url, {
        method: "GET"
    });
    const {name} = await response.json();
    const greetingName = document.querySelector('p.user-name');
    greetingName.textContent = ` Hallo ${name} !`;
    greetingName.style.fontSize = '16px';
    greetingName.style.fontWeight = '600';
    greetingName.style.color = '#303030';
}

async function createOrderRow(orderID, orderDate, orderTotal) {
    const tableBody = document.querySelector('.table tbody');
   
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${orderID}</td>
        <td>${orderDate}</td>
        <td>${orderTotal} €</td>
        <td><a href="#" class="view" data-order-id="${orderID}">view</a></td>
    `;
   
    tableBody.appendChild(row);
    const viewOrderButton = row.querySelector('a.view');
    viewOrderButton.addEventListener('click', function(event){
        //event.preventDefault();
        window.location.href = `orderPage.html?id=${orderID}`;
    });
}

async function getAllOrders(){
    const url = "http://localhost:5502/api/orders";
    const response = await fetch(url, {
        method: "GET"
    });
    const orders  = await response.json();
    orders.forEach(order =>{
        createOrderRow(order.order_id, order.order_date, order.total_cost);
    });
    
}

async function logOut(){
    const logOutButton = document.querySelector('a#LogOut.nav-link');
    logOutButton.addEventListener('click', async (event) =>{
        const url = "http://localhost:5502/api/user/logout";
        const response = await fetch(url, {
            method: "POST"
        });
        const res = await response.json();
        event.preventDefault();
        if(response.status === 200){
            showToast(res.message);
            setTimeout(() => {
                window.location.href = "index.html"
            }, 1000);
        }
    });
}