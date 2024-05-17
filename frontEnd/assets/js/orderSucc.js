document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get('t');

    const pageAccessed = sessionStorage.getItem('pageAccessed');

    if(t != null ){
        init();
    }else{
        window.location.href='index.html';
    }
});

async function init(){
    try {
        const response = await fetch(`http://localhost:5502/api/user/auth/status`);
        const data = await response.json();
        const cart = getCart();

        sessionStorage.setItem('pageAccessed', 'true');
        
        const orderText = document.querySelector('h2');
        if(data.isAuthenticated){
            
            
            //get totalCost
            let totalCost = 0;
            for(const item of cart){
                totalCost += await getTotal(item.id, item.quantity);
            }

            //update quantity
            for(const item of cart){
                let x = await getQuantityFromDataBase(item.id);
                x -= item.quantity;
                await updateQuantityInDataBase(item.id, x);
            }

            //create Order in DataBase
            const url = "http://localhost:5502/api/orders/order";
            const res = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({totalCost, cart}),
            });

            const { message } = await res.json();
            orderText.textContent = message;
            if(message === 'Access denied.'){
                const statusIconElement = document.getElementById('status-icon');
        
                // Remove the existing icon
                statusIconElement.innerHTML = '';

                // Create a new icon element
                const iconElement = document.createElement('i');

                iconElement.className = 'fa fa-minus-circle fa-xl';
                iconElement.style.color = 'red';

                statusIconElement.appendChild(iconElement);
            }

            //Clear local cart
            localStorage.removeItem('cart');
        }else{
            //update quantity
            for(const item of cart){
                let x = await getQuantityFromDataBase(item.id);
                x -= item.quantity;
                await updateQuantityInDataBase(item.id, x);
            }
            
            localStorage.removeItem('cart');
        }
    } catch (error) {
        
    }
    myAccountlink();
}

function accesDenied(){
    sessionStorage.removeItem('pageAccessed');
    window.location.href='index.html';
}


async function getTotal(parfumId, quantity){
    const url = `http://localhost:5502/api/parfums/total/${parfumId}?quantity=${quantity}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const res = await response.json();
        return res.price;
    } catch (error) {
        console.error('Error fetching total:', error);
    }
}

async function getQuantityFromDataBase(id){

    const urlGET = `http://localhost:5502/api/parfums/id/${id}`;
    const responseGET = await fetch(urlGET, {
        method: "GET",
    });

    const resGET = await responseGET.json();
    const restInDataBase = resGET[0].rest; 
    
    return restInDataBase;
    
}

async function updateQuantityInDataBase(id, rest){
    
    const url = `http://localhost:5502/api/parfums/${id}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({rest})
    });

    const res = await response.json();
}


