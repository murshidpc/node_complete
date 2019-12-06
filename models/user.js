const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
    constructor(username, email, cart, id){
        this.user = username;
        this.email = email;
        this.cart  = cart;
        this._id = id;
    }
    save(){
        db = getDb();
        return db.collection('users').insertOne(this)
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        })
    }
    addToCart(product){
 
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let productQuant = 1;
        const updatedCartItems = [...this.cart.items];

        if(cartProductIndex >= 0){
            productQuant = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = productQuant;
        }
        else{
            updatedCartItems.push({productId:new mongodb.ObjectID(product._id), quantity: productQuant});
        }
        const updatedCart = {items: updatedCartItems};
        const db = getDb();
        return db.collection('users')
        .updateOne({_id: new mongodb.ObjectID(this._id)}, {$set: {cart: updatedCart}});
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
          return i.productId;
        });
        return db
          .collection('products')
          .find({ _id: { $in: productIds } })
          .toArray()
          .then(products => {
            return products.map(p => {
              return {
                ...p,
                quantity: this.cart.items.find(i => {
                  return i.productId.toString() === p._id.toString();
                }).quantity
              };
            });
          });
      }

      deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
          return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectID(this._id) },
            { $set: { cart: {items: updatedCartItems} } }
          );
      }

    static findById(userId){
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(userId)})
        .then(user => {
            return user;
        })        
        .catch(er => {
            console.log(err);
        })
    }
}

module.exports = User;