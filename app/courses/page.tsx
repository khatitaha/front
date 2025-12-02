'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getCourses, deleteCourse } from '../../lib/api';
import type { Course } from '../../lib/data';
import CourseForm from '../../components/CourseForm';

const CoursesPage = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [displayCourses, setDisplayCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const filterCourses = useCallback((courses: Course[], term: string) => {
    return courses.filter(course =>
      course.name.toLowerCase().includes(term.toLowerCase()) ||
      course.description.toLowerCase().includes(term.toLowerCase())
    );
  }, []);

  const refreshCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const coursesData = await getCourses();
      setAllCourses(coursesData);
    } catch (err) {
      setError('Failed to load courses. Please make sure the API gateway is running and properly configured.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCourses();
  }, [refreshCourses]);

  useEffect(() => {
    setDisplayCourses(filterCourses(allCourses, searchTerm));
  }, [searchTerm, allCourses, filterCourses]);

  const handleAdd = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (courseId: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
        setAllCourses(prev => prev.filter(c => c.id !== courseId)); // Optimistic update
      } catch (err) {
        setError('Failed to delete course.');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSaveCourse = (course: Course) => {
    if (editingCourse) {
      setAllCourses(allCourses.map(c => c.id === course.id ? course : c));
    } else {
      setAllCourses([...allCourses, course]);
    }
    handleCloseModal();
  };

  if (isLoading) {
    return <div>Loading courses...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      {isModalOpen && (
        <CourseForm 
          course={editingCourse}
          onSave={handleSaveCourse}
          onClose={handleCloseModal}
        />
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Courses</h1>
        <button className="btn btn-primary" onClick={handleAdd}>Add Course</button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Course Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Schedule</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>{course.category}</td>
              <td>{course.schedule}</td>
              <td>
                <Link href={`/courses/${course.id}`} className="btn btn-sm btn-outline-info me-2">View</Link>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(course)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(course.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoursesPage;