const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    const authHeader = req.get('Authorization');
    if (!authHeader){
       req.isAuth = true;
       return next();
    }
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token,'supersecretsecretsecret');
    }catch(err){
        req.isAuth = true;
        return next();
    }
    if (!decodedToken){
        req.isAuth = true;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
}