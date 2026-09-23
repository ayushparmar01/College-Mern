/*
const path = require("path");
app.use(express.static(path.join(__dirname, "frontend")));
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

*/

require("dotenv").config();
const path = require("path");
const express = require("express");
const courseRoutes = require("./routes/courseRoutes");
const connectDB = require("./config/db");
const practiceRoutes = require("./routes/PracticeRoutes");
const studentRoutes = require("./routes/createStudentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const bcrypt = require("bcrypt");
const User = require("./models/userModel");
const authRoutes = require("./routes/authRoutes");

// Name of the folder that holds index.html, style.css and app.js
// const FRONTEND_DIR = "public";
const fs = require("fs");

// Auto-detect the folder that contains index.html
const FRONTEND_DIR =
    ["public", "frontend"].find((dir) =>
        fs.existsSync(path.join(__dirname, dir, "index.html"))
    ) || "public";

console.log("Serving frontend from:", path.join(__dirname, FRONTEND_DIR));
console.log("index.html found:", fs.existsSync(path.join(__dirname, FRONTEND_DIR, "index.html")));

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, FRONTEND_DIR)));
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

