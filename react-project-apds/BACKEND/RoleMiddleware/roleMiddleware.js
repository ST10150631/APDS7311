const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.user; // Assuming the role is attached to req.user after authentication

        if (allowedRoles.includes(role)) {
            next(); 
        } else {
            res.status(403).send({ error: "Access denied" });
        }
    };
};

module.exports = checkRole;