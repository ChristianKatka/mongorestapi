const express = require('express');

const checkAuth = require('../auth/check-auth');
const ordersController = require('../controllers/orders-controller');

const router = express.Router();



router.get('/', checkAuth, ordersController.get_all_orders);


router.post('/', checkAuth, ordersController.create_order);


router.get('/:orderId', checkAuth, ordersController.get_single_order);


router.delete('/:orderId', checkAuth, ordersController.delete_order);



module.exports = router;