const express = require("express");

const {
    registerUser,
    loginUser,
    getUsers
} = require("../controllers/userControllers");

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Get All Users
router.get("/", getUsers);

module.exports = router;

