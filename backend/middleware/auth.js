// Authenticates user's requests; verifies the JWT token and adds user information to the request object.

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']; // when you make a request, include the token in the headers
    if (!token) {
        return res.status(403).json({ msg: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        req.user = decoded;  // Add the decoded user info to the request object
        next();
    });
};

module.exports = verifyToken;