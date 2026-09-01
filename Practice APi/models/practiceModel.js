const mongoose = require("mongoose");

const practiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
        trim: true
    },

    email: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
        trim: true,
        lowercase: true
    },

    age: {
        type: Number,
        required: true,
        min: 18,
        max: 24
    },

    course: {
        type: String,
        required: true,
        enum: ["JAVA", "Python", "MERN", "C++", "NumPy", "Pandas"],
        maxLength: 30,
        trim: true
    },

    branch: {
        type: String,
        required: true,
        enum: ["CSE", "AIML", "CE", "ME", "ECE", "EE"],
        maxLength: 30,
        trim: true
    }
});

const PracticeApi = mongoose.model("PracticeApi", practiceSchema);

module.exports = PracticeApi;