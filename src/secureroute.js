let express = require('express');
let router = express.Router();
const { managerAuthMiddleWare, validatorAuthMiddleware, sessionMiddleware } = require('./middleware/authMiddleware');

router.use(['/manager','/validator','/validator/prompt-page'],sessionMiddleware);

router.get('/manager', managerAuthMiddleWare, (req, res) => {
    res.send("I am a manager")
})

router.get('/validator', validatorAuthMiddleware, (req, res) => {
    res.send("I am a validator");
})

router.get('/validator/prompt-page', validatorAuthMiddleware, (req, res) => {
    const { displayName } = req.session.passport.user;
    res.render('validator-prompt-page.ejs',{username:displayName});
  });

module.exports = router;