const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
    constructor(username, email){
        this.user = username;
        this.email = email;
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

    static findById(userId){
        const db = getDb();
        return db.collection('user').findOne({_id: new mongodb.ObjectID(userId)})
        .then(user => {
            return user;
        })        
        .catch(er => {
            console.log(err);
        })
    }
}

module.exports = User;