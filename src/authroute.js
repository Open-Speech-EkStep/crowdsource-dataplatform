const express = require('express');
const router = express.Router();
const passport = require('passport');
const util = require('util');
const url = require('url');
const querystring = require('querystring');
const jsonwebtoken = require('jsonwebtoken');

const redirectUser = (user, res) => {
    const permissions = user.permissions;
    if(permissions.includes("validator:action")){
      res.redirect('/validator/prompt-page');
    }else if(permissions.includes("manager:action")){
      res.redirect('/manager');
    } else {
      res.redirect('/');
    }
}

const getLogOutUrl = (req) => {
  let returnTo = req.protocol + '://' + req.hostname;
  let port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }
  let logoutURL = new url.URL(
    util.format("https://"+process.env.AUTH_ISSUER_DOMAIN+'/v2/logout')
  );
  let searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;
  return logoutURL;
}

const clearSessionAndRedirect = (req,res, logoutURL) => {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err)
      }
      console.log("Destroyed the user session on Auth0 endpoint");
      res.redirect(logoutURL);
    });
  }
}

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile metadata language',
  audience: process.env.API_AUDIENCE
}), function (req, res) {
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }

    if (!user) { return res.redirect('/'); }

    let decoded = jsonwebtoken.decode(user.accessToken);
    user.permissions = decoded.permissions;
    
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      redirectUser(user, res)
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  const logoutURL = getLogOutUrl(req);

  clearSessionAndRedirect(req, res, logoutURL);
});


module.exports = router;