const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const MONGO_DB = 'mongodb+srv://murshidpc:mur%24hidPC8606@cluster0-gj9sp.mongodb.net/shop?retryWrites=true&w=majority';
const store = new mongodbStore({
  collection: 'sessions',
  uri: MONGO_DB
})
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave:false, saveUninitialized: false, store: store}));

app.use((req, res, next) => {
  if(!req.session.user){
      return next();
  }
    User.findById(req.session.user._id).then((user) => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
   
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getError);

//app.listen(5000);

mongoose.connect(MONGO_DB,  { useNewUrlParser: true })
.then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'murshi',
          email: 'murshidpc@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });