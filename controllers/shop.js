const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render('shop/product-details', {
      product:product,
      pageTitle: 'Product Details',
      path:''
    });
  });
  // res.redirect('/');
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartArray = [];
      for(let i=0;i<cart.product.length;i++){
        let prod = products.find(p => p.id === cart.product[i].id)
        cartArray.push({products:prod, qty:cart.product[i].qty});
      }   
      // console.log(cartArray);
      res.render('shop/cart', {
        pageTitle: 'My Cart',
        path: '/cart',
        cartItem: cartArray,
        price: cart.totalPrice
      })
    })    
      
    })
    
  }


exports.postCart = (req, res, next) => {
  const prodId = req.body.Id;
  Product.findById(prodId, (prod) => {
    Cart.addProduct(prodId, prod.price);
  })
  res.redirect('/cart');
}

// exports.getDetails = (req, res, next) => {
//   const prodId = req.params.productId;
//   Product.findById(prodId, product => {
//     console.log(product);
//   });
//   res.redirect('/');
// }

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.deleteCartProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  Product.findById(prodId, prod => {
    Cart.deleteProduct(prodId, prod.price);
  }) 
  res.redirect('/cart');
  
}