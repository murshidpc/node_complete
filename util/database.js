const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (cb) => {
    MongoClient.connect('mongodb+srv://murshidpc:mur%24hidPC8606@cluster0-gj9sp.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true })
    .then(client => {
        console.log('connected');
        _db = client.db();
        cb();
    })
    .catch( err => {
        console.log(err);
    });
}

const getDb = () => {
    if(_db){
        return _db;
    }
    else{
        throw 'no datbase Found!';
    }
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;