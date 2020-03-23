
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.get_all_orders = (req, res, next) => {
    Order.find()
        .select('_id quantity product')
        // property name
        .populate('product', 'name price')
        .then(response => {
            res.status(200).json({
                count: response.length,
                orders: response,
                request: {
                    type: 'GET'
                }
            });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
};


exports.create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            // if no product is found by given id
            if (!product) {
                // because returning code below wont run
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            order.save().then(response => {
                console.log(response);
                res.status(201).json({
                    message: 'Order stored succesfully',
                    createdOrder: response
                });
            }).catch(err => {
                res.status(500).json({ error: err });
            });

        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};


exports.get_single_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product', 'name price')
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'Order not found' })
            }
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json({ error: err });
        });
};



exports.delete_order = (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId })
        .then(response => {
            res.status(200).json({
                message: 'Order deleted succesfully',
            })
        }).catch(err => {
            res.status(500).json({ error: err });
        });
};





