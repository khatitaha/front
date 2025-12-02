'use client';

import { useState, useEffect } from 'react';
import type { Student, University } from '../lib/data';
import { getUniversities } from '../lib/api';

interface StudentFormProps {
  student?: Student | null;
  onSave: (student: Student) => void;
  onClose: () => void;
}

const StudentForm = ({ student, onSave, onClose }: StudentFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    university: {
      id: 0,
      name: ''
    },
  });
  const [universities, setUniversities] = useState<University[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const unis = await getUniversities();
        setUniversities(unis);
        if (student) {
          setFormData({
            name: student.name,
            address: student.address,
            university: { id: student.university.id, name: student.university.name }
          });
        } else if (unis.length > 0) {
          setFormData(prev => ({ ...prev, university: { id: unis[0].id, name: unis[0].name } }));
        }
      } catch (err) {
        console.error('Failed to load universities.');
      }
    };
    fetchUniversities();
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'university_id') {
      const selectedUniversity = universities.find(u => u.id === parseInt(value));
      if (selectedUniversity) {
        setFormData(prev => ({
          ...prev,
          university: { id: selectedUniversity.id, name: selectedUniversity.name },
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Student);
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{student ? 'Edit Student' : 'Add Student'}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="university_id" className="form-label">University</label>
                <select className="form-select" id="university_id" name="university_id" value={formData.university.id} onChange={handleChange}>
                  {universities.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
