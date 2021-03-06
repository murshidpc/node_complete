const Product = require("../models/product");
const mongodb = require("mongodb");
const { validationResult } = require("express-validator/check");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    errorArray: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      errorArray: errors.array()
    });
  }
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log('product created');
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
  // res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(prod => {
      if (!prod) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: prod,
        hasError: false,
        errorMessage: null,
        errorArray: []
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.prodId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc
      },
      errorMessage: errors.array()[0].msg,
      errorArray: errors.array()
    });
  }

  Product.findById(productId)
    .then(product => {
      // throw new Error();
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      (product.title = updatedTitle),
        (product.imageUrl = updatedImageUrl),
        (product.price = updatedPrice),
        (product.description = updatedDesc);
      return product.save().then(result => {
        res.redirect("/admin/products");
      });
    })
    .catch(err => {
      // console.log(err);
      res.redirect("/500");
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.prodId;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};
