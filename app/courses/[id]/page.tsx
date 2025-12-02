'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCourseById } from '../../../lib/api';
import type { Course } from '../../../lib/data';
import React from 'react';

const CourseDetailPage = ({ params }: { params: { id: string } }) => {
  const courseId = parseInt(params.id, 10);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isNaN(courseId)) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const courseData = await getCourseById(courseId);
        if (courseData) {
          setCourse(courseData);
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return (
      <div>
        <h1>Course not found</h1>
        <Link href="/courses">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Course Details</h1>
        <Link href="/courses" className="btn btn-outline-secondary">
          Back to Courses List
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>{course.name}</h3>
        </div>
        <div className="card-body">
          <p><strong>ID:</strong> {course.id}</p>
          <p><strong>Description:</strong> {course.description}</p>
          <p><strong>Category:</strong> {course.category}</p>
          <p><strong>Schedule:</strong> {course.schedule}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
