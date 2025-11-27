'use client';

import { useState, useEffect } from 'react';
import { courses as initialCourses } from '../../lib/data';
import type { Course } from '../../lib/data';
import CourseForm from '../../components/CourseForm';

const CoursesPage = () => {
  const [allCourses, setAllCourses] = useState<Course[]>(initialCourses);
  const [displayCourses, setDisplayCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    const filteredCourses = allCourses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayCourses(filteredCourses);
  }, [searchTerm, allCourses]);

  const handleAdd = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };
  
  const handleDelete = (courseId: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setAllCourses(allCourses.filter(c => c.id !== courseId));
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
            <th>Instructor</th>
            <th>Category</th>
            <th>Schedule</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.instructor}</td>
              <td>{course.category}</td>
              <td>{course.schedule}</td>
              <td>
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