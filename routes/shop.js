const express = require('express');
const path = require('path');
const adminData = require('./admin');

const router = express.Router();
const dir = require('../util/path');

router.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', {prods: products, pageTitle: 'My Shop', path: '/'});
});

module.exports = router;