// // import chalk from 'chalk';
// /*
// const chalk = require('chalk');
// require('dotenv').config();

// console.log(chalk.colorNames);
// console.log(process.env.EMAIL);
// console.log(process.env.PASSWORD);



// const fs = require("fs");

// // for write file we can use writefile method of fs module
// fs.writeFile("notes.txt", "hello", (err) => {
//     if (err) throw err;
//     console.log("File written successfully!");
// });


// // for reading file we can use readFile method of fs module
// fs.readFile("notes.txt", "utf8", (err, data) => {
//     if (err) throw err;
//     console.log("File read successfully!");
//     console.log(data);
// });

// // for append file we can use appendFile method of fs module
// fs.appendFile("notes.txt", "\nWorld", "utf8", (err, data) => {
//     if (err) throw err;
//     console.log("File appended successfully!");
//     console.log(data);
// });



// const http = require("http");

// const server = http.createServer((req, res) => {
//     res.end("Hello from the server");
// });

// server.listen(8000, () => {
//     console.log("server Running on port 8000");
// });

// const http = require("http");

// const server = http.createServer((req, res) => {
//     console.log(req.method, req.url);
//     res.end("end");
// });

// server.listen(3000, () => {
//     console.log("server Running on port 3000");
// });



// const http = require("http");
// const server = http.createServer((req, res) => {
//     if(req.url === "/home") {
//         res.end("Home Page");
//     } else if(req.url === "/about") {
//         res.end("About Page");
//     } else if (req.url === "/contact") {
//         res.end("Contact Page");
//     } else {
//         res.end("Error Page");
//     }
// });

// server.listen(3000, () => {
//     console.log("server Running on port 3000");
// });

// */


// // let students = [];
// // // let count = data.students.length;
// // const express = require("express");
// // const app = express();
// // app.use(express.json());

// // const cors = require("cors");
// // app.use(cors());

// // app.get("/students", (req, res) => {
// //     res.json({ students: students }); 
// // });

// // app.post("/students", (req, res) => {
// //     students.push(req.body);
// //     res.json({ message: "Student added successfully" });
// // });

// // app.listen(3000, () => {
// //     console.log("Server is running on port 3000");
// // });


// // using middlewares

// app.use((req, res, next) => {
//     console.log("Middleware executed");
//     next();
// });

// app.get("/", (req, res) => {
//     res.send("Home");
// });


// app.use((req, res, next) => {
//     console.log("Middleware 1");
//     next();
// });

// app.use((req, res, next) => {
//     console.log("Middleware 2");
//     next();
// });

// // logger middleware

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
// });

// app.get("/about", (req, res) => {
//     res.send("About");
// });
// const express = require("express");
// const app = express();

// function authentication(req, res, next) {
//     const token = req.headers.token;

//     if (token === "1345") {
//         next();
//     } else {
//         res.status(401).send("Unauthorized");
//     }
// }

// app.get("/dashboard", authentication, (req, res) => {
//     res.send("Welcome");
// });

const express = require("express")
const studentRoutes = require("./routes/studentsRoutes");

const app = express()

app.use(express.json());

app.use("/students", studentRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
});