const Teacher = require("../models/teacherModel");

const createTeacher = async (req, res) => {
    try {
        const {
            teacherName,
            subject,
            experience,
            email,
            department
        } = req.body;

        const teacher = await Teacher.create({
            teacherName,
            subject,
            experience,
            email,
            department
        });

        res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            data: teacher
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create teacher",
            error: error.message
        });
    }
};

module.exports = {
    createTeacher
};