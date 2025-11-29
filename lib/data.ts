export interface University {
  id: number;
  name: string;
}

// Updated Student interface to match GraphQL schema
export interface Student {
  id: number;
  name: string; // Combined first and last name
  address: string;
  university: University;
}

export interface Course {
  id: number;
  name: string;
  instructor: string;
  category: string;
  schedule: string;
}

export interface StudentCourse {
  student_id: number;
  course_id: number;
}

export const universities: University[] = [
  { id: 1, name: "Abdelhamid Mehri University"},
  { id: 2, name: "University of Algiers 1" },
];

// Updated students mock data
export const students: Student[] = [
  { id: 101, name: "Amina Benali", address: "123 Rue de la Liberte, Constantine", university: { id: 1, name: "Abdelhamid Mehri University" } },
  { id: 102, name: "Karim Ziani", address: "456 Avenue de l'Independance, Constantine", university: { id: 1, name: "Abdelhamid Mehri University" } },
  { id: 103, name: "Fatima Salah", address: "789 Boulevard des Martyrs, Algiers", university: { id: 2, name: "University of Algiers 1" } },
  { id: 104, name: "Mehdi Lounis", address: "101 Rue Didouche Mourad, Constantine", university: { id: 1, name: "Abdelhamid Mehri University" } },
  { id: 105, name: "Lina Boudiaf", address: "212 Rue des Palmiers, Algiers", university: { id: 2, name: "University of Algiers 1" } },
];

export const courses: Course[] = [
  { id: 201, name: "Software Development Engineering", instructor: "Dr. Ahmed Khemis", category: "Computer Science", schedule: "Mon, Wed 10:00-11:30" },
  { id: 202, name: "Data Science Fundamentals", instructor: "Prof. Leila Nasri", category: "Data Science", schedule: "Tue, Thu 13:00-14:30" },
  { id: 203, name: "Intelligent Systems", instructor: "Dr. Yacine Haddad", category: "AI", schedule: "Mon, Wed 14:00-15:30" },
  { id: 204, name: "Microservices Architecture", instructor: "Dr. Ahmed Khemis", category: "Software Architecture", schedule: "Fri 09:00-12:00" },
];

export const studentCourses: StudentCourse[] = [
  { student_id: 101, course_id: 201 },
  { student_id: 101, course_id: 202 },
  { student_id: 102, course_id: 201 },
  { student_id: 102, course_id: 203 },
  { student_id: 103, course_id: 202 },
  { student_id: 104, course_id: 204 },
  { student_id: 105, course_id: 202 },
  { student_id: 105, course_id: 203 },
];
