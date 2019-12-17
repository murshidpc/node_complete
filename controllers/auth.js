const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transport = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: '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'
    }
}));
exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    // console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    })
}

exports.getSignUp = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('auth/signup', {
        path:'/signup',
        pageTitle: 'SignUp',
        errorMessage: message
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then((user) => {
        if(!user){
            req.flash('error', 'invalid email or password');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch){
                req.session.user = user;
                req.session.isLoggedIn = true;
                return req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            req.flash('error', 'invalid email or password');
            res.redirect('/login'); 
        })
        
    })
    .catch(err => console.log(err));
   
}

exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})
    .then(userDoc => {
        if(userDoc){
            req.flash('error', 'E-mail alredy exists. Please pick other email');
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12)
    .then(hashPassword => {
            const user = new User({
                email: email,
                password: hashPassword,
                cart: { items: [] }
            })
            return user.save();
        })        
    })
    .then(result => {
        res.redirect('/login');
        return transport.sendMail({
            to: email,
            from: 'shop@node-complete.com',
            subject: 'SignUp Succeded!',
            html: '<h1>You Successfully Signed Up!'
        })
    })
    .catch(err => {
        console.log(err);
    })

}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });   
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('auth/reset', {
        path:'/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      User.findOne({ email: req.body.email })
        .then(user => {
          if (!user) {
            req.flash('error', 'No account with that email found.');
            return res.redirect('/reset');
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        .then(result => {
          res.redirect('/');
          transporter.sendMail({
            to: req.body.email,
            from: 'shop@node-complete.com',
            subject: 'Password reset',
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
            `
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  };