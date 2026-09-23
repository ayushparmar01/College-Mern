/*
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

        // Mongoose validation error
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

    

        // Other errors
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
*/

const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        teacherName: { type: String, required: true, trim: true },
        subject: { type: String, required: true, trim: true },
        experience: { type: Number, required: true, min: 0 },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        department: { type: String, required: true, trim: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);