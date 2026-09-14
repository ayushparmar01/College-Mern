const Student = require("../models/createStudentModel");

const createStudent = async (req, res) => {
    try {
        const { name, age, course, email, branch } = req.body;

        const student = await Student.create({
            name,
            age,
            course,
            email,
            branch
        });

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create student",
            error: error.message
        });
    }
};

module.exports = {
    createStudent
};