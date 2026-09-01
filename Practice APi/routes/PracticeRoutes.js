const express = require("express");

const router = express.Router();

const {
    getStudentsOlder21,
    getMJStudents,
    getStudentsStartingWithA,
    getStudentCountByCourse,
    getStudentAverageAgeByCourse
} = require("../controllers/practiceController");


// Age >= 21
router.get("/students/older21", getStudentsOlder21);


// Course = MERN OR JAVA
router.get("/students/mj", getMJStudents);


// Name starts with A
router.get("/students/name-a", getStudentsStartingWithA);

// Count of students by course
router.get("/students/count-by-course", getStudentCountByCourse);

router.get("/students/average-age-by-course", getStudentAverageAgeByCourse);

module.exports = router;