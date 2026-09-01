// async function fetchstudent() {

//     try {
//         const response = await fetch('http://localhost:3000/student');
//         const students = await response.json();
//         const studentsList = document.getElementById('student-list');
//         studentsList.innerHTML = '';
//         students.forEach(student => {
//             const li = document.createElement('li');
//             li.textContent = `${student.name} - ${student.age}`;
//             studentsList.appendChild(li);
//         });
//         console.log("students fetch successfully", students);
//     } catch (error) {
//         console.log('Error fetching successfully:', error);  

//     }
// }

async function addStudent(event) {
    const id = document.getElementsById('studentsId').value;
    const name = document.getElementsById('studentName').value;
    const city = document.getElementsById('studentCity').value;

    const student = {id, name, city};

    try {
        const response = await fetch('http://localhost:3000/student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });
       
        if (!response.ok) {
            throw new Error('Failed to add student: $(response.status)');
        }

        const result = await response.json();
        console.log(result.message);

    } catch (error) {
        console.log('Error adding student:', error);
    }
}