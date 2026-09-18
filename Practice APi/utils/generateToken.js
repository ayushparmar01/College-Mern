const jwt = require("jsonwebtoken");
// const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

module.exports = { generateAccessToken, generateRefreshToken };