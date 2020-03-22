const mongoose = require('mongoose');
const express = require('express');
const checkAuth = require('../auth/check-auth');
// Parsing images
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {

    // accept file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        // reject file
        cb(null, false)
    }
};
// fileSize in bytes. Accepts files up to 5 megabytes
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 5 } });

const router = express.Router();

const Product = require('../models/product');


router.get('/', (req, res, next) => {
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
});

// Upload single file(name of the field which holds the file)
router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
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
});


router.get('/:productId', (req, res, next) => {
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

});

/** Updates one or more fields in db
 * 
 * in body: [{"propertyName": "name", "value": "Superman"}]
 */
router.patch('/:productId', checkAuth, (req, res, next) => {
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
});


router.delete('/:productId', checkAuth, (req, res, next) => {
    Product.remove({ _id: req.params.productId })
        .then(result => {
            res.status(200).json({
                message: 'Product deleted succesfully'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});

module.exports = router;