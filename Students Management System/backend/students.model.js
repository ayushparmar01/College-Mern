const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    course: String,
    age: Number
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;

/*
find by id
const student = await Student.findById(
    req.params.id
);

// update by id
const student = 
    await Student.findByIdAndUpdate (
    req.params.id,
    req.body,
    { new: true }
);

*/

