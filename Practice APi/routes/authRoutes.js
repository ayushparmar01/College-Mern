const express = require("express");

const router = express.Router();
const authenticateUser = require("../middlewares/authMiddleware");

const {
    registerUser, 
    loginUser, 
    logoutUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateUser, (req, res) => {
    res.json({ success: true, user: req.user });
});
router.get("/profile", authenticateUser, (req, res) => {
    res.json({ success: true, message: "Token verified!", user: req.user });
});

router.post("/logout", authenticateUser, logoutUser);   

console.log("DEBUG authController exports:", require("../controllers/authController"));
module.exports = router;