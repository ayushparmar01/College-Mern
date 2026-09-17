require("dotenv").config();
const courseRoutes = require("./routes/courseRoutes");
const express = require("express");
const connectDB = require("./config/db");
const practiceRoutes = require("./routes/PracticeRoutes");
const studentRoutes = require("./routes/createStudentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const bcrypt = require('bcrypt');
const User = require("./models/userModel");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


connectDB();

app.use("/api/practice", practiceRoutes);
app.use("/api", courseRoutes);
app.use("/api", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", authRoutes);

async function hashPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashedPassword);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

function main() {
    const password = "12345";
    hashPassword(password)
    .then((hasspassword) => {
        console.log("Hashed Password:", hasspassword);
    })  
    .catch((error) => {
        console.error("Error hashing password:", error);
    });
}

function comparePassword(plainPass, hashedPass) {
    bcrypt.compare(plainPass, hashedPass) 
        .then((isMatch) => {
            if (isMatch) {
                console.log("Password match");
            } else {
                console.log("Password does not match");
            }
        })
        .catch((error) => {
            console.error("Error comparing passwords:", error);
        });
}

main();
app.get("/", (req, res) => {
    res.send("Welcome to the Practice API");
});
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});



