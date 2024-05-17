// This is your test publishable API key.
const stripe = Stripe("pk_test_51PCgVf02m0sUr8hQJR1hSnomACUUWGR6QWOXhxC5enJDJ7V84lnIt9E8DQm60ka3HuJmv6O26KuoLEapqODmosoD00FiVvWP5O", {
    locale: 'de'
});

let suc_url;
// The items the customer wants to buy
const items = getCart();

initialize();
checkStatus();

document
.querySelector("#payment-form")
.addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
    const response = await fetch(`http://localhost:5502/api/stripe/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
    });
    const { clientSecret, clientBSecret, t} = await response.json(); //the respone from server to JSON!
    document.getElementById("total").textContent = "Summe: "  + (clientBSecret / 100).toFixed(2) + " €";
    suc_url = `http://localhost:5502/orderSucc.html?t=${t}`;
    const appearance = {
        theme: 'stripe',
        variables: {
        colorPrimary: '#DF9A91',
        
        colorText: '#313030',
        colorDanger: '#a00909',
        fontFamily: 'Jost, sans-serif',
        spacingUnit: '3px',
        }
    };
    elements = stripe.elements({ appearance, clientSecret });

    const paymentElementOptions = {
        layout: "accordion",
    };
    
    const options = {mode: 'shipping', allowedCountries: ['DE'], fields: {phone: 'always'}};

    const addressElement = elements.create('address', options);
    const paymentElement = elements.create("payment", paymentElementOptions);
    paymentElement.mount("#payment-element");
    addressElement.mount('#address-element');
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    
    const emailInput = document.getElementById("email").value;
    
   
    if (!emailInput.trim()) {
        showMessage("Bitte geben Sie eine E-Mail-Adresse ein.");
        setLoading(false);
        return; 
    }

    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
        
        return_url: suc_url,
        receipt_email: document.getElementById("email").value,
        },
    });
    
    if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message);
    } else {
        showMessage("An unexpected error occurred.");
    }

    setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
    );

    if (!clientSecret) {
        return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
        case "succeeded":
        showMessage("Zahlung erfolgreich abgeschlossen!");
        break;
        case "processing":
        showMessage("Ihre Zahlung wird bearbeitet.");
        break;
        case "requires_payment_method":
        showMessage("Ihre Zahlung war nicht erfolgreich. Bitte versuchen Sie es erneut.");
        break;
        default:
        showMessage("Etwas ist schief gelaufen.");
        break;
    }
}

// ------- UI helpers -------

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
    }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}