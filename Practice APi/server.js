require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const practiceRoutes = require("./routes/PracticeRoutes");

const app = express();

app.use(express.json());

connectDB();

app.use("/api/practice", practiceRoutes);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});