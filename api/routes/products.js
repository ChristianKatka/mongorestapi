const express = require('express');

const productsController = require('../controllers/products-controller');
const checkAuth = require('../auth/check-auth');


// Parsing images
const multer = require('multer');

// pass to options where to save file and what name should it have
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

// which kind of files get accepted
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



router.get('/', productsController.get_all_products);

/** Create product to the database
 * Upload single file(name of the field which holds the file)
 * Accepts form data because multer
 */
router.post('/', checkAuth, upload.single('productImage'), productsController.create_order);

// Get one product by id
router.get('/:productId', checkAuth, productsController.get_single_product);

// Edit one order by id
router.patch('/:productId', checkAuth, productsController.update_product);

// Delete one order by id
router.delete('/:productId', checkAuth, productsController.delete_product);

module.exports = router;