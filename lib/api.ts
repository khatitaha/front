"use server";

import type { Student, Course, University } from './data';
import { studentCourses, courses as mockCourses } from './data';

const BASE_URL = 'http://localhost:8086';

let universities: University[] = [];

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getStudents = async (): Promise<Student[]> => {
  console.log('Fetching students from API...');
  const response = await fetch(`${BASE_URL}/api/students/getAll`);
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  const data = await response.json();
  console.log('Fetched students:', data);
  return data;
};

export const getStudentById = async (id: number): Promise<Student | undefined> => {
  const response = await fetch(`${BASE_URL}/api/students/${id}`);
  if (!response.ok) {
    // Return undefined or handle as per application's error handling strategy
    return undefined;
  }
  return response.json();
};

export const addStudent = async (student: Omit<Student, 'id'>): Promise<Student> => {
  const studentDataForApi = {
    name: student.name,
    address: student.address,
    university: {
      id: student.university.id,
    },
  };

  const response = await fetch(`${BASE_URL}/api/students/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentDataForApi),
  });

  if (!response.ok) {
    throw new Error('Failed to add student');
  }
  return response.json();
};

export const updateStudent = async (student: Student): Promise<Student> => {
  const studentDataForApi = {
    name: student.name,
    address: student.address,
    university: {
      id: student.university.id,
    },
  };

  const response = await fetch(`${BASE_URL}/api/students/update/${student.id}`, { // Assuming an update endpoint like this
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentDataForApi),
  });

  if (!response.ok) {
    throw new Error('Failed to update student');
  }
  return response.json();
};

export const deleteStudent = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/students/delete/${id}`, { // Assuming a delete endpoint like this
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete student');
  }
};

export const addCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  const response = await fetch(`${BASE_URL}/api/courses/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error('Failed to add course');
  }
  return response.json();
};

export const updateCourse = async (course: Course): Promise<Course> => {
  const response = await fetch(`${BASE_URL}/api/courses/${course.id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error('Failed to update course');
  }
  return response.json();
};

export const deleteCourse = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/courses/${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete course');
  }
};


export const getUniversities = async (): Promise<University[]> => {
  if (universities.length === 0) {
    const response = await fetch(`${BASE_URL}/api/university/getAll`);
    if (!response.ok) {
      throw new Error('Failed to fetch universities');
    }
    universities = await response.json();
  }
  return universities;
};

export const getUniversityById = async (id: number): Promise<University | undefined> => {
  if (universities.length === 0) {
    await getUniversities();
  }
  return universities.find(u => u.id === id);
};

export const getCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${BASE_URL}/api/courses/`);
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
};

export const getCourseById = async (id: number): Promise<Course | undefined> => {
      console.log('trying to fecth course by id:', id);

  const response = await fetch(`${BASE_URL}/api/courses/${id}/`);
    // const response = await fetch(`http://localhost:8086/api/courses/1/`);
    console.log('Response for course id fetch:', response);

  if (!response.ok) {
    return undefined;
  }
  return response.json();
};

export const getCoursesForStudent = async (studentId: number): Promise<Course[]> => {
  await delay(100);
  const courseIds = studentCourses
    .filter(sc => sc.student_id === studentId)
    .map(sc => sc.course_id);
  
  return mockCourses.filter(course => courseIds.includes(course.id));
};