const express = require('express');
const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();
const {check, body} = require('express-validator');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignUp);

router.post('/login', authController.postLogin);

router.post('/signup',
 [check('email').isEmail().withMessage('Please enter a valid email').custom((value, {req}) => {
    return User.findOne({email: value})
    .then(userDoc => {
        if(userDoc){
           return Promise.reject('E-mail alredy exists. Please pick other email');
        }
 })
}),
  body('password', 'Please enter a valid password').isLength({min: 5}).isAlphanumeric(),
body('confirmPassword').custom((value, {req}) => {
    if(value !== req.body.password){
        throw new Error('password have to match!')
    }
    return true;
})], 
 authController.postSignUp);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;


