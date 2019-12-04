const getDb = require('../util/database').getDb;

class Product {
  constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;    
      }
  
  save(){
      const db = getDb();
      return db.collection('products').insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }    
}


module.exports = Product;
















// const fs = require('fs');
// const path = require('path');
// const Cart = require('./cart');

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'Data',
//   'product.json'
// );

// const getProductsFromFile = cb => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

// module.exports = class Product {
//   constructor(id, title, imageUrl, price, description) {
//     this.id= id,
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;    
//   }

//   save() {
//     getProductsFromFile(products => {
//       if(this.id){
//         const existingProductIndex = products.findIndex(p => p.id === this.id);
//         const updatedProduct = [...products];
//         updatedProduct[existingProductIndex] = this;
//         fs.writeFile(p, JSON.stringify(updatedProduct), err => {
//           console.log(err);
//         });
//       }
//       else{
//         this.id = Math.random().toString();
//         getProductsFromFile(products => {
//           products.push(this);
//           fs.writeFile(p, JSON.stringify(products), err => {
//             console.log(err);
//           });
//         });
//       }
//     })    
//   }

//   static fetchAll(cb) {
//     getProductsFromFile(cb);
//   }

//   static findById(id, cb) {
//     getProductsFromFile(products => {
//       const product = products.find(p => p.id === id);
//       cb(product);
//     });
//   }

//   static deleteById(id){
//       getProductsFromFile(products => {
//         const product = products.find(p => p.id === id);
//         const updatedProduct = products.filter(p => p.id !== id);
//         fs.writeFile(p, JSON.stringify(updatedProduct), err => {
//           if(!err){
//             Cart.deleteProduct(id, product.price);
//           }
//         });
//       })
//   }
// };

