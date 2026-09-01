const API_URL = "http://localhost:3000/students";


// ==========================================
// GET ALL STUDENTS
// ==========================================

async function getStudents() {

    try {

        const response = await fetch(API_URL);

        const students = await response.json();

        displayStudents(students);

    } catch (error) {

        console.error("Error:", error);

        alert("Unable to connect to server");

    }
}


// ==========================================
// DISPLAY STUDENTS
// ==========================================

function displayStudents(students) {

    const studentsList = document.getElementById("studentsList");

    studentsList.innerHTML = "";

    if (students.length === 0) {

        studentsList.innerHTML = "<p>No students found.</p>";

        return;
    }

    students.forEach(student => {

        const studentCard = document.createElement("div");

        studentCard.className = "student-card";

        studentCard.innerHTML = `
            <h3>${student.name}</h3>

            <p><strong>ID:</strong> ${student.id}</p>

            <p><strong>Email:</strong> ${student.email}</p>

            <p><strong>Course:</strong> ${student.course}</p>

            <button class="edit-btn"
                onclick="updateStudent(${student.id})">
                Update
            </button>

            <button class="delete-btn"
                onclick="deleteStudent(${student.id})">
                Delete
            </button>
        `;

        studentsList.appendChild(studentCard);

    });
}


// ==========================================
// GET STUDENT BY ID
// ==========================================

async function getStudent() {

    const id = document.getElementById("studentId").value;

    if (!id) {

        alert("Please enter student ID");

        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {

            const error = await response.json();

            alert(error.message);

            return;
        }

        const student = await response.json();

        displayStudents([student]);

    } catch (error) {

        console.error("Error:", error);

        alert("Unable to connect to server");

    }
}


// ==========================================
// ADD STUDENT
// ==========================================

document
    .getElementById("studentForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const course = document.getElementById("course").value;

        const studentData = {
            name: name,
            email: email,
            course: course
        };

        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(studentData)

            });

            const data = await response.json();

            if (!response.ok) {

                alert(data.message);

                return;
            }

            alert(data.message);

            document.getElementById("studentForm").reset();

            getStudents();

        } catch (error) {

            console.error("Error:", error);

            alert("Unable to add student");

        }

    });


// ==========================================
// UPDATE STUDENT
// ==========================================

async function updateStudent(id) {

    const name = prompt("Enter new name:");

    if (name === null) {
        return;
    }

    const email = prompt("Enter new email:");

    if (email === null) {
        return;
    }

    const course = prompt("Enter new course:");

    if (course === null) {
        return;
    }

    const updatedData = {
        name: name,
        email: email,
        course: course
    };

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(updatedData)

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        alert("Student updated successfully");

        getStudents();

    } catch (error) {

        console.error("Error:", error);

        alert("Unable to update student");

    }
}


// ==========================================
// DELETE STUDENT
// ==========================================

async function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        alert(data.message);

        getStudents();

    } catch (error) {

        console.error("Error:", error);

        alert("Unable to delete student");

    }
}


// ==========================================
// LOAD STUDENTS WHEN PAGE OPENS
// ==========================================

getStudents();