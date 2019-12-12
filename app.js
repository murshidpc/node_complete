const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5df2410a6c7356797a7980e1').then((user) => {
        // console.log(user);
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
   
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

//app.listen(5000);

mongoose.connect('mongodb+srv://murshidpc:mur%24hidPC8606@cluster0-gj9sp.mongodb.net/shop?retryWrites=true&w=majority',  { useNewUrlParser: true })
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