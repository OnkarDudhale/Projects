const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../auth.js');
const userController=require('../controllers/users.js');

router.route('/signup')
.get(userController.signup)
.post(wrapAsync(userController.newUser));

router.route('/login')
.get(userController.login)
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
userController.auth);

router.get('/logout', (userController.logout));

module.exports = router;