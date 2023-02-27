const jwt = require('jsonwebtoken');

const config = require("../config/auth.config.js");

exports.verifyToken = (req, res, next) => {
    try {
        // Request headers example:
        // { Authorization: 'Bearer YOUR_TOKEN' }

        const authorization = req.headers.authorization;

        // Validate inputs
        if (!authorization) {
            return res.status(403).send({ message: "Please provide a valid token." });
        }

        if (!authorization.startsWith('Bearer')) {
            return res.status(403).send({ message: "Please provide a valid token." });
        }

        // Extract the token
        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(403).send({ message: "Please provide a valid token." });
        }

        // Verify the token
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Please provide a valid token.",
                });
            }

            // Set username for the next action
            req.username = decoded.username;

            // Invoke the next action
            next();
        });
    } catch (err) {
        return res.status(500).send({ message: err.message || "Error occurred while verifying token." });
    }
}