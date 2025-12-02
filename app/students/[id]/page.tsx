'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudentById, getCoursesForStudent, getUniversityById } from '../../../lib/api';
import type { Student, Course, University } from '../../../lib/data';
import React from 'react';

const StudentDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
      const { id } = React.use(params);
  
  const studentId = parseInt(id, 10);
  const [student, setStudent] = useState<Student | null>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isNaN(studentId)) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const studentData = await getStudentById(studentId);
        if (studentData) {
          console.log("Fetched student data:", studentData);
          setStudent(studentData);
          const universityData = studentData.university;
          const coursesData = await getCoursesForStudent(studentData.id);
          setUniversity(universityData || null);
          setEnrolledCourses(coursesData);
        }
      } catch (error) {
        console.error("Failed to fetch student details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return (
      <div>
        <h1>Student not found</h1>
        <Link href="/students">Back to Students</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Student Details</h1>
        <Link href="/students" className="btn btn-outline-secondary">
          Back to Students List
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>{student.name}</h3>
        </div>
        <div className="card-body">
          <p><strong>ID:</strong> {student.id}</p>
          <p><strong>Address:</strong> {student.address}</p>
          <p><strong>University:</strong> {university ? university.name : 'N/A'}</p>
        </div>
      </div>

      <h4>Enrolled Courses</h4>
      {enrolledCourses.length > 0 ? (
        <ul className="list-group">
          {enrolledCourses.map(course => (
            <li key={course.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">{course.name}</h6>
                <small className="text-muted">{course.description} - {course.category}</small>
              </div>
              <span className="badge bg-primary r ounded-pill">{course.schedule}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>This student is not enrolled in any courses.</p>
      )}
    </div>
  );
};

export default StudentDetailPage;