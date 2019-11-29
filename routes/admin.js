const express = require('express');

const router = express.Router();

const products = require('../controllers/products');


router.get('/add-product', products.addProducts);

router.post('/add-product', products.postAddProducts);

module.exports = router;
