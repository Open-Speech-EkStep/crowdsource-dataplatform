const express = require('express');
const router = express.Router();
const passport = require('passport');
const util = require('util');
const url = require('url');
const querystring = require('querystring');
const jsonwebtoken = require('jsonwebtoken');

const getLogOutUrl = (req) => {
    let returnTo = req.protocol + '://' + req.hostname;
    const port = req.connection.localPort;
    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo += ':' + port;
    }
    const logoutURL = new url.URL(
        util.format("https://" + process.env.AUTH_ISSUER_DOMAIN + '/v2/logout')
    );
    logoutURL.search = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo
    });
    return logoutURL;
}

const clearSessionAndRedirect = (req, res) => {
    const logoutURL = getLogOutUrl(req);

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

const passportAuthenticate = passport.authenticate('auth0', {
    scope: 'openid email profile metadata language',
    audience: process.env.API_AUDIENCE,
})

const redirectToHome = (req,res) => res.redirect('/');

// Perform the login, after login Auth0 will redirect to callback
// router.get('/login', passport.authenticate('auth0', {
//     scope: 'openid email profile metadata language',
//     audience: process.env.API_AUDIENCE,
// }), function (req, res) {
//     res.redirect('/');
// });


router.get('/login/validator', function (req,res,next){
        req.session.role = {action: 'validator:action', landingPage: '/validator/prompt-page'};
        next();
    }
    ,passportAuthenticate, redirectToHome);

router.get('/login/manager',
    function (req,res,next){
        req.session.role = {action: 'manager:action', landingPage: process.env.AUTH0_ADMIN_LOGIN_URL};
        next();
    }
    ,passportAuthenticate, redirectToHome);


// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
    passport.authenticate('auth0', function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.redirect('/');
        }

        const decoded = jsonwebtoken.decode(user.accessToken);
        user.permissions = decoded.permissions;

        const {action, landingPage} = req.session.role;

        if (!(user.permissions.includes(action))) {
            return res.redirect('/logout')
        }

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            res.redirect(landingPage);
        });
    })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
    req.logout();
    clearSessionAndRedirect(req, res);
});

module.exports = router;
