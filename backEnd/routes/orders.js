const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {createOrder, addItemToOrder} = require('../base/createOrder');
const pool = require('../base/db');
router.use(bodyParser.json())
const {isAuthenticated} = require('../middleware/auth');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const moment = require('moment');

router.post('/order', isAuthenticated, async(req, res) =>{
    const userId = req.user.id;
    const {totalCost, cart} = req.body;
    try {
        const orderId = await createOrder(userId, totalCost);
        
        if(cart && cart.length > 0){
            for (const item of cart){
                console.log(`Adding item ${item.id} to order ${orderId} with quantity of ${item.quantity}`);
                await addItemToOrder(orderId, item.id, item.quantity);
            }
        }

        res.status(200).json({message: 'Deine Bestellung ist bei uns eingegangen Vielen Dank für Dein Einkauf!', orderID: orderId});
        
    } catch (error) {
        res.status(500).json({message: "Leider ist etwas schief gegangen!"});
    }
});

router.get('/', isAuthenticated, async(req, res)=>{
    const userId = req.user.id; 

    try {
        const orders = await getAllOrdersForUser(userId);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: "Unable to fetch orders." });
    }
});

async function getAllOrdersForUser(userId) {
    const query = 'SELECT * FROM orders WHERE user_id = $1;';
    try {
        const result = await pool.query(query, [userId]);
        for(let i = 0; i < result.rows.length; i++){
           result.rows[i].order_date = moment(result.rows[i].order_date).format('DD.MM.YYYY');
        }
        
        return result.rows;
    } catch (err) {
        console.error('Failed to retrieve orders:', err);
        throw err;
    }
}

router.get('/order/:orderId', isAuthenticated, async (req, res) => {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);

    if (!orderId) {
        return res.status(400).json({ message: "Invalid order ID." });
    }

    try {
        const orderDetails = await getOrderDetails(orderId, userId);
        if (orderDetails) {
            //res.status(200).json(orderDetails);
            res.status(200).json({o_id: orderDetails.order_id, o_tc: orderDetails.total_cost, o_d: moment(orderDetails.order_date).format('DD.MM.YYYY'), o_i: orderDetails.items});
        } else {
            res.status(404).json({ message: "Order not found." });
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: "Unable to fetch order details." });
    }
});

async function getOrderDetails(orderId, userId) {
    const orderQuery = 'SELECT * FROM orders WHERE order_id = $1 AND user_id = $2;';
    const itemsQuery = 'SELECT * FROM order_items WHERE order_id = $1;';

    try {
        const orderResult = await pool.query(orderQuery, [orderId, userId]);
        if (orderResult.rows.length === 0) {
            return null; // No order found, or not belonging to user
        }

        const order = orderResult.rows[0];
        const itemsResult = await pool.query(itemsQuery, [orderId]);
        const items = itemsResult.rows;

        return { ...order, items }; // Combine order and items into one object
    } catch (err) {
        console.error('Failed to retrieve order details:', err);
        throw err;
    }
}
module.exports = router;

