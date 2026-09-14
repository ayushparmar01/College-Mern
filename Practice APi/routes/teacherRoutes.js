const express = require("express");

const {
    createTeacher
} = require("../controllers/teacherController");

const router = express.Router();

router.post("/create", createTeacher);

module.exports = router;