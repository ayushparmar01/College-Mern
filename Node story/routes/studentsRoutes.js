const express = require("express");
const router = express.Router();

const { getStudents, addStudent } = require("../controllers");

routes.get("/", getStudents);
routes.post("/", addStudents);

module.exports = router;
