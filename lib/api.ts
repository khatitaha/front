import { students, courses, studentCourses, universities } from './data';
import type { Student, Course, University } from './data';

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getStudents = async (): Promise<Student[]> => {
  await delay(100);
  return students;
};

export const getStudentById = async (id: number): Promise<Student | undefined> => {
  await delay(100);
  return students.find(s => s.id === id);
};

export const getUniversityById = async (id: number): Promise<University | undefined> => {
  await delay(100);
  return universities.find(u => u.id === id);
};

export const getCourses = async (): Promise<Course[]> => {
  await delay(100);
  return courses;
};

export const getCoursesForStudent = async (studentId: number): Promise<Course[]> => {
  await delay(100);
  const courseIds = studentCourses
    .filter(sc => sc.student_id === studentId)
    .map(sc => sc.course_id);
  
  return courses.filter(course => courseIds.includes(course.id));
};
