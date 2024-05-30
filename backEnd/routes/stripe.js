const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
require('dotenv').config();
//const stripe = //hier sollte auch private_key von Stripe (Here private_key from stripe too!)
const cookieParser = require('cookie-parser');
router.use(cookieParser());

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
});

router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  const cart_p = await formatCartData(items);
  
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(cart_p),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  
  res.send({
    clientSecret: paymentIntent.client_secret,
    clientBSecret: paymentIntent.amount,
    t: process.env.SUCC_PAGE_T
  });

});

function generateRandomString(length){
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}


async function formatCartData(cart) {
  // Ensure that cart is always an array
  if (!Array.isArray(cart)) {
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
                  price: parseFloat(productInfo.price)
              };
          } else {
              console.error("Product info not found for ID:", item.id);
              return null;
          }
      }));
      return updatedCart.filter(item => item !== null); // Filter out null items
  } catch (error) {
      console.error('Failed to fetch product info:', error);
      return cart; // Return the original cart if an error occurs
  }
}

async function getProductInfo(id) {
  try {
      const response = await fetch(`http://localhost:5502/api/parfums/id/${id}`);
      const products = await response.json();  

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
          return {};
      }
  } catch (error) {
      console.error(`Error loading the data for ${id}: `, error);
      return {};
  }
}

function calculateOrderAmount(items){
  let totalPrice = 0;
  items.forEach(element => {
    totalPrice += (element.price * 100) * element.quantity ;
  });
  console.log(parseInt(totalPrice));
  return parseInt(totalPrice);
}

module.exports = router;