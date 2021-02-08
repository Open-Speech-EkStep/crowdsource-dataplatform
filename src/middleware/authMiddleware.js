var jsonwebtoken = require('jsonwebtoken');

const managerAuthMiddleWare = (req, res, next) => {
    try{
        let permissions = req.session.passport.user.permissions;
        if (permissions.includes("manager:action")) {
            next();
        } else {
            console.log("permission not present");
            res.sendStatus(401);
        }
    } catch(err){
        console.log(err);
        res.sendStatus(401);
    }
}

const validatorAuthMiddleware = (req, res, next) => {
    try{
        let permissions = req.session.passport.user.permissions;
        if (permissions.includes("validator:action")) {
            next();
        } else {
            console.log("permission not present");
            res.sendStatus(401);
        }
    }catch(err){
        console.log(err);
        res.sendStatus(401);
    }
    
}

const sessionMiddleware = (req, res, next) => {
    if (!req.session) {
        res.sendStatus(401);
        return;
    }
    if (!req.session.passport) {
        res.sendStatus(401);
        return;
    }
    if (!req.session.passport.user) {
        res.sendStatus(401);
        console.log("User not present");
        return;
    }
    const permissions = req.session.passport.user.permissions;
    if (!permissions || permissions.length == 0) {
        console.log("Permissions not present")
        res.sendStatus(401);
        return;
    }
    next();
};

module.exports = { managerAuthMiddleWare, validatorAuthMiddleware,sessionMiddleware };