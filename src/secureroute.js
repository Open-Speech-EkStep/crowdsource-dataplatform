let express = require('express');
let router = express.Router();
const { managerAuthMiddleWare, validatorAuthMiddleware, sessionMiddleware } = require('./middleware/authMiddleware');

router.use(['/manager','/validator'],sessionMiddleware);

router.get('/manager', managerAuthMiddleWare, (req, res) => {
    res.send("I am a manager")
})

router.get('/validator', validatorAuthMiddleware, (req, res) => {
    res.send("I am a validator")
})

module.exports = router;