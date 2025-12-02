'use client';

import { useState, useEffect } from 'react';
import type { Course } from '../lib/data';
import { addCourse, updateCourse } from '../lib/api';

interface CourseFormProps {
  course?: Course | null;
  onSave: (course: Course) => void;
  onClose: () => void;
}

const CourseForm = ({ course, onSave, onClose }: CourseFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    schedule: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        category: course.category,
        description: course.description,
        schedule: course.schedule,
      });
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let savedCourse: Course;
      if (course) {
        // Editing existing course
        savedCourse = await updateCourse({ ...formData, id: course.id });
      } else {
        // Adding new course
        savedCourse = await addCourse(formData);
      }
      onSave(savedCourse); // Update parent state with the API's returned course
    } catch (err: any) {
      setError(err.message || 'Failed to save course.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{course ? 'Edit Course' : 'Add Course'}</h5>
              <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Course Name</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isLoading} />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <input type="text" className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} required disabled={isLoading} />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <input type="text" className="form-control" id="category" name="category" value={formData.category} onChange={handleChange} required disabled={isLoading} />
              </div>
              <div className="mb-3">
                <label htmlFor="schedule" className="form-label">Schedule</label>
                <input type="text" className="form-control" id="schedule" name="schedule" value={formData.schedule} onChange={handleChange} required disabled={isLoading} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>Close</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
