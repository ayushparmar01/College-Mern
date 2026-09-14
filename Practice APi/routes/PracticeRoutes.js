const express = require("express");

const router = express.Router();

const {
     getAllStudents, 
    getStudentsOlder21,
    getMJStudents,
    getStudentsStartingWithA,
    getStudentCountByCourse,
    getStudentAverageAgeByCourse,
    getStudentsSortedByAge,
    createStudentEmail,
    explainEmailQuery
} = require("../controllers/practiceController");

router.get("/students", getAllStudents);

// Age >= 21
router.get("/students/older21", getStudentsOlder21);


// Course = MERN OR JAVA
router.get("/students/mj", getMJStudents);


// Name starts with A
router.get("/students/name-a", getStudentsStartingWithA);

// Count of students by course
router.get("/students/count-by-course", getStudentCountByCourse);

router.get("/students/average-age-by-course", getStudentAverageAgeByCourse);



// Sort students by age
router.get("/students/sorted-by-age", getStudentsSortedByAge);

router.post("/students/create-email", createStudentEmail);

router.get("/students/explain-email-query", explainEmailQuery);

router.get("/students/explain-email", explainEmailQuery);

module.exports = router;