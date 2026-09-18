/*
const { model } = require("mongoose");

const authenticateUser = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ 
            message: "Authorization header missing" 
        });

        // authHeader = "Bearer <token>";
        authHeader = authHeader.split(" "); 
        
        parts = ["Bearer", "<token>"];

        if(parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({   
            message: "Invalid authorization header format"

         const token = parts[1];
         
        //  token = "<token>";

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }  catch (error) {
            return res.status(401).json({ 
                message: "Invalid or expired token" 
            });
        }   
    }
    module

    */

const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing"
        });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization header format"
        });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { userId, role }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateUser;    