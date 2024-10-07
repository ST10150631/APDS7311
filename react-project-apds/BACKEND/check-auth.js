const jwt = require("jsonwebtoken");

//------------------------------------------------------//
//Checks if the users token is authorized 
const checkAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const decoded = jwt.verify(token, "this_secret_should_be_longer_than_it_is");
        req.user = decoded; 
        next(); 
    } catch (error) {
        res.status(401).json({
            message: "Token invalid or expired",
            error: error.message, 
        });
    }
};
//------------------------------------------------------//
module.exports = checkAuth;

//--------------------------END OF FILE----------------------------//