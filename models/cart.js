const path = require('path');
const fs = require('fs');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'Data',
    'cart.json'
  );

module.exports = class Cart{
    static addProduct(id, productPrice){
           fs.readFile(p, (err, fileContent) => {
               let cart = {product: [], totalPrice: 0};
               if(!err){
                    cart = JSON.parse(fileContent);
               }
               const existingProductIndex = cart.product.findIndex(p => p.id === id);
               const existingProduct = cart.product[existingProductIndex];
               let updatedProduct;
               if(existingProduct){
                    updatedProduct = { ...existingProduct };
                    updatedProduct.qty = updatedProduct.qty + 1;
                    cart.product = [...cart.product];
                    cart.product[existingProductIndex] = updatedProduct;
               }
               else{
                   updatedProduct = {id: id, qty: 1};    
                   cart.product = [...cart.product, updatedProduct];               
               }
               cart.totalPrice =cart.totalPrice + +productPrice;  
               fs.writeFile(p, JSON.stringify(cart), (err) => {
                   console.log(err);
               })             
           }) 
    }
    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            if(err){
                return;
            }
            const Cart = {...JSON.parse(fileContent)};
            const product = Cart.product.find(p => p.id === id);
            const Qty = product.qty;
            Cart.product = Cart.product.filter(p => p.id !== id);
            Cart.totalPrice = Cart.totalPrice - Qty*productPrice;
            fs.writeFile(p, JSON.stringify(Cart), (err) => {
                console.log(err);
            })              
            
        });
    }
    static getCart(cb){
        fs.readFile(p, (err, fileContent) => {
            if(err){
                cb(null);
            }
            else{
                cb(JSON.parse(fileContent));
            }
        })
    }
    // static deleteById(id ,price){
    //     this.getCart( cart => {
    //         const prod = cart.product.find(p => p.id === id);
    //         const qty = prod.qty;
    //         cart.product = cart.product.filter(p => p.id !== id);
    //         cart.totalPrice = cart.totalPrice - qty*price;
    //         fs.writeFile(p, JSON.stringify(cart), (err) => {
    //             console.log(err);
    //         })
    //     })
    // }
};