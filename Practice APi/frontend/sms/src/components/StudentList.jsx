import { useEffect, useState } from "react";
import StudentCard from "./StudentCard";
import StudentForm from "./StudentForm";

const STORAGE_KEY = "sms-students";

const seedStudents = [
  {
    id: "seed-1",
    name: "Ojas Varshney",
    age: 25,
    email: "ojas.varshney@example.com",
    course: "MERN Stack Development",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    country: "India",
    academicRating: 4.7,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
];

function StudentList() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : seedStudents;
    } catch {
      return seedStudents;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch {
      /* ignore */
    }
  }, [students]);

  function handleAdd(newStudent) {
    setStudents((prev) => [newStudent, ...prev]);
  }

  function handleDelete(id) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  function handleEdit(student) {
    // Placeholder for now — wire this up to an edit modal/form later if needed.
    console.log("Edit clicked for:", student);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start gap-8 lg:flex-row">
        <StudentForm onAdd={handleAdd} />

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Students <span className="text-slate-400">({students.length})</span>
            </h2>
          </div>

          {students.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
              No students yet — add one using the form.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentList;