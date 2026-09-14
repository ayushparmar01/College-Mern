const Course = require("../models/courseModel");

const createCourse = async (req, res) => {
    try {
        const { title, duration, teacher } = req.body;

        const course = await Course.create({
            title,
            duration,
            teacher
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCourse
};