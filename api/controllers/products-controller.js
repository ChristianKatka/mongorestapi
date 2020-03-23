const mongoose = require('mongoose');

const Product = require('../models/product');


exports.get_all_products = (req, res, next) => {
    Product.find()
        // Which fields are selected and shown to user
        .select('name price _id productImage')
        .then(data => {
            const response = {
                count: data.length,
                // map it into new array (better practice)
                products: data.map(document => {
                    return {
                        _id: document._id,
                        name: document.name,
                        price: document.price,
                        productImage: document.productImage,
                        request: {
                            type: 'GET',
                            url: 'http:/localhost:3000/products/' + document._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};


exports.create_order = (req, res, next) => {
    // req.file comes available after adding upload middleware here
    console.log(req.file);

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        // store only the path to the file. file path is "fetched" from multer
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Product created succesfully',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'POST'
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });

};

exports.get_single_product = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id productImage')
        .then(doc => {
            if (doc) {
                console.log(doc);
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET'
                    }
                });
            }
            // If given id has right amount of characters mongoose returns null AKA valid object id 
            else {
                res.status(404).json({ message: 'No data found by given id' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

};


/** Updates one or more fields in db
 * 
 * in body: [{"propertyName": "name", "value": "Superman"}]
 */
exports.update_product = (req, res, next) => {
    const updateOperations = {};
    for (const operations of req.body) {
        updateOperations[operations.propertyName] = operations.value;
    }

    Product.update({ _id: req.params.productId }, { $set: updateOperations })
        .then(result => {
            res.status(200).json({
                message: 'Product updated succesfully'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};


exports.delete_product = (req, res, next) => {
    Product.deleteOne({ _id: req.params.productId })
        .then(result => {
            res.status(200).json({
                message: 'Product deleted succesfully'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

};




