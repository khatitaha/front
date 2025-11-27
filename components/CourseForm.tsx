'use client';

import { useState, useEffect } from 'react';
import type { Course } from '../../lib/data';

interface CourseFormProps {
  course?: Course | null;
  onSave: (course: Course) => void;
  onClose: () => void;
}

const CourseForm = ({ course, onSave, onClose }: CourseFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    category: '',
    schedule: '',
  });

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        instructor: course.instructor,
        category: course.category,
        schedule: course.schedule,
      });
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCourse: Course = {
      id: course?.id || new Date().getTime(), // Mock new ID
      ...formData,
    };
    onSave(finalCourse);
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{course ? 'Edit Course' : 'Add Course'}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Course Name</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="instructor" className="form-label">Instructor</label>
                <input type="text" className="form-control" id="instructor" name="instructor" value={formData.instructor} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <input type="text" className="form-control" id="category" name="category" value={formData.category} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="schedule" className="form-label">Schedule</label>
                <input type="text" className="form-control" id="schedule" name="schedule" value={formData.schedule} onChange={handleChange} required />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
