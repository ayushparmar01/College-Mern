const express = require("express");
const router = express.Router();

const { createCourse } = require("../controllers/coursecontrollers");

router.post("/courses", createCourse);

module.exports = router;