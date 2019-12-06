const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, price, description, null, req.user._id);
  product.save()
  .then( result => {
    // console.log('product created');
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  })
  // res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(prod => {
    if(!prod){
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing:editMode,
      product:prod
    });
  }) 
  .catch(err => {
    console.log(err);
  }) 
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.prodId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product( updatedTitle, updatedImageUrl, updatedPrice, updatedDesc, new mongodb.ObjectID( productId));
    updatedProduct.save();
    res.redirect('/admin/products');

};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.deleteProduct = (req, res, next) => {
    const productId = req.body.prodId;
    Product.deleteById(productId);
    res.redirect('/admin/products');
};