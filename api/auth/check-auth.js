const jwt = require('jsonwebtoken');
require('dotenv/config');

// Middleware syntax
module.exports = (req, res, next) => {
    try {
        // POSTMAN: Headers -> Authorization: bearer token
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRETKEY, null);
        // now we can access it by jwtUserData
        req.jwtUserData = decodedToken;
        next();
    } catch (error) {
        // 401 = unauthenticated
        res.status(401).json({
            message: 'Auth failed'
        });
    }
};