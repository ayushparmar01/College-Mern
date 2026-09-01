const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");
const app = express();

app.use(cors());
app.use(express.json());


connectDB();
app.use(express.json());

    let students = [
    {
        id: 1,
        name: "Ayush Sharma",
        email: "ayush.sharma@gmail.com",
        course: "MERN Stack"
    },
    {
        id: 2,
        name: "Rahul Verma",
        email: "rahul.verma@gmail.com",
        course: "Data Science"
    },
    {
        id: 3,
        name: "Priya Singh",
        email: "priya.singh@gmail.com",
        course: "Web Development"
    },
    {
        id: 4,
        name: "Aman Gupta",
        email: "aman.gupta@gmail.com",
        course: "Python"
    },
    {
        id: 5,
        name: "Neha Agarwal",
        email: "neha.agarwal@gmail.com",
        course: "Java"
    },
    {
        id: 6,
        name: "Rohit Kumar",
        email: "rohit.kumar@gmail.com",
        course: "MERN Stack"
    },
    {
        id: 7,
        name: "Sneha Yadav",
        email: "sneha.yadav@gmail.com",
        course: "Artificial Intelligence"
    },
    {
        id: 8,
        name: "Karan Mehta",
        email: "karan.mehta@gmail.com",
        course: "Cyber Security"
    },
    {
        id: 9,
        name: "Anjali Sharma",
        email: "anjali.sharma@gmail.com",
        course: "Data Analytics"
    },
    {
        id: 10,
        name: "Vivek Singh",
        email: "vivek.singh@gmail.com",
        course: "Full Stack Development"
    }
];


app.get('/', (req, res) => {
    res.send('Server is running!');
});

// APIS
app.get('/students', (req, res) => {
    res.json(students);
});

// to find the specific number of students
app.get('/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json(student);
});

// POST API - Add New Student
app.post('/students', (req, res) => {

    const { name, email, course } = req.body;

    if (!name || !email || !course) {
        return res.status(400).json({
            message: "Name, email and course are required"
        });
    }

    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
        email: req.body.email,
        course: req.body.course
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});


// to update the students details using patch method
app.patch("/students/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const result = await students.updateOne(
            { _id: id },
            { $set: req.body }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid student ID"
        });
    }
});
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, email, course } = req.body;

    if (name !== undefined) {
        student.name = name;
    }

    if (email !== undefined) {
        student.email = email;
    }

    if (course !== undefined) {
        student.course = course;
    }

    res.status(200).json(student);


// to delete the object in students

app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    // using splice method to delete the multiple students
    const deletedStudent = students.splice(index, 1);

    res.status(200).json({
        message: "students deleted successfully",
        student: deletedStudent[0]
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


