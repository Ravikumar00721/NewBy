const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchasync');
const users=require('../controllers/user');

router.get('/register',users.reForm);
router.post('/register', catchAsync(users.register));
router.get('/login', users.logForm);
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.log)
// const redirectUrl = req.session.returnTo || '/campgrounds';: This line determines the URL to which the user will be redirected
//  after successful login. It checks if there is a "returnTo" property in the user's session data. If it exists, it sets redirectUrl to the value of "returnTo," which is typically used to store the originally requested URL before the login page. If "returnTo" is not present, it defaults to "/campgrounds."

// delete req.session.returnTo;: This line removes the "returnTo" property from the user's session data to prevent further redirects to the same URL on subsequent login attempts.

// res.redirect(redirectUrl);: Finally, this line sends a redirect response to the client, redirecting them to the URL specified in the redirectUrl variable, which was determined in step 5.
router.get('/logout', users.logout);
module.exports = router;