const Product = require('../models/product');

exports.addProducts = (req, res, next) => {
    res.render('add-product', {pageTitle: 'Add Product', path: '/admin/add-product'});
  }

exports.postAddProducts = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/')
  }  

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop', {prods: products, pageTitle: 'My Shop', path: '/'});
  });    
  }  

exports.errorPage = (req, res, next) => {
    res.status(404).render('pageNotFound', {pageTitle: 'Page Not Found', path: '/'});
}  