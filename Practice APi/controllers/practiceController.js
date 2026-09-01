const PracticeApi = require("../models/practiceModel");

// Find students age >= 21
exports.getStudentsOlder21 = async (req, res) => {
    try {
        const students = await PracticeApi.find({
            age: { $gte: 21 }
        });

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch students",
            error: error.message
        });
    }
};


// Find students whose course is MERN OR JAVA
exports.getMJStudents = async (req, res) => {
    try {
        const students = await PracticeApi.find({
            $or: [
                { course: "MERN" },
                { course: "JAVA" }
            ]
        });

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No students found with MERN or JAVA course"
            });
        }

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch students",
            error: error.message
        });
    }
};


// Find students whose name starts with A
exports.getStudentsStartingWithA = async (req, res) => {
    try {
        const students = await PracticeApi.find({
            name: { $regex: "^A", $options: "i" }
        });

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No students found whose name starts with A"
            });
        }

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch students",
            error: error.message
        });
    }
};

// to count the number of students in each course using aggregation framework
exports.getStudentCountByCourse = async (req, res) => {
    try {
        const result = await PracticeApi.aggregate([
            {
                $group: {
                    _id: "$course",
                    count: { $sum: 1 }
                }
            },
            {$sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to count students by course",
            error: error.message
        });
    }
};

// to calculate the average age of students in each course using aggregation framework
exports.getStudentAverageAgeByCourse = async (req, res) => {
    try {
        const result = await PracticeApi.aggregate([
            {
                $group: {
                    _id: "$course",
                    averageAge: { $avg: "$age" }
                }
            },
            {$sort: { averageAge: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to calculate average age by course",
            error: error.message
        });
    }
};