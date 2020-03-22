
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
mongoose.connect('mongodb+srv://admin:admin@shop-3jrpt.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => console.log(error));




// Middleware that logs http requests like: 'GET /orders 200 9.200 ms - 24'
app.use(morgan('dev'));
// Application can accept and read incoming data. ex: req.body.username
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static AKA public. Makes uploads folder available in browser and able to see pictures by just typing path in URL
app.use('/uploads', express.static('uploads'));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, Content-Type, Accept'
//     );
// });

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// if program gets to this point where no available routes were called
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    // forward the request. and forward error request instead of the original request 
    next(error);
});

// Db thrown errors catched here
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })

});


module.exports = app;