// Login
export const saveLogin = (user) => {
  localStorage.setItem("loginUser", JSON.stringify(user));
};

export const getLogin = () => {
  return JSON.parse(localStorage.getItem("loginUser"));
};

export const logout = () => {
  localStorage.removeItem("loginUser");
};

// Students CRUD
export const getStudents = () => {
  return JSON.parse(localStorage.getItem("students")) || [];
};

export const saveStudents = (students) => {
  localStorage.setItem("students", JSON.stringify(students));
};

export const addStudent = (student) => {
  const students = getStudents();
  students.push(student);
  saveStudents(students);
};

export const updateStudent = (index, student) => {
  const students = getStudents();
  students[index] = student;
  saveStudents(students);
};

export const deleteStudent = (index) => {
  const students = getStudents();
  students.splice(index, 1);
  saveStudents(students);
};
