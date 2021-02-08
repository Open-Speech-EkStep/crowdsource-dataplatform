var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
var jsonwebtoken = require('jsonwebtoken');

// dotenv.config();

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile metadata language',
  audience: process.env.AUDIENCE_URL
}), function (req, res) {
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/'); }
    var decoded = jsonwebtoken.decode(user.accessToken);
    user.permissions = decoded.permissions;
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const permissions = user.permissions;
      if(permissions.includes("validator:action")){
        res.redirect('/validator');
      }else if(permissions.includes("manager:action")){
        res.redirect('/manager');
      } else {
        res.redirect(returnTo || '/');
      }
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }
  var logoutURL = new url.URL(
    util.format(process.env.AUTH0_ISSUER_BASE_URL+'v2/logout')
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});



module.exports = router;