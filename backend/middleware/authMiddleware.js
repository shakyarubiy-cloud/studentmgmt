
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.json({
            message: "Access Denied"
        });
    }



    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.json({
                message: "Invalid Token"
            });
        }

        req.user = decoded;

        next();
    });
};

const isAdmin = (req, res, next) => {

    if (req.user.role !== "admin") {
        return res.json({
            message: "Access Denied. Admin only."
        });
    }

    next();
};


module.exports={
    verifyToken,
    isAdmin
}