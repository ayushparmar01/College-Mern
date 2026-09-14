const PracticeApi = require("../models/practiceModel");



exports.getAllStudents = async (req, res) => {
    try {
        const students = await PracticeApi.find();

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

// to sort the students by age in ascending order
exports.getStudentsSortedByAge = async (req, res) => {
    try {

        const order = req.query.order || "asc";;
        let sortOrder;
        
        if(order === "asc") {
            sortOrder = 1;
        } else if(order === "desc") {
            sortOrder = -1;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid order parameter. Use 'asc' or 'desc'."
            }); 
        }


        const students = await PracticeApi.find()
            .sort({ age: sortOrder });

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch students sorted by age",
            error: error.message
        });
    }
};

// create a students on email
exports.createStudentEmail = async (req, res) => {
    try {
        const index = await PracticeApi.collection.createIndex(
            { email: 1 },
            { unique: true }
        );

        res.status(200).json({
            success: true,
            message: "Email unique index created successfully",
            index: index
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create email index",
            error: error.message
        });
    }
};

// Explain the email query parameter
exports.explainEmailQuery = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email query parameter is required"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Email query parameter received",
            email: email
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to explain email query",
            error: error.message
        });
    }
};

