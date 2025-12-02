'use client';

import { useState, useEffect } from 'react';
import type { University } from '../lib/data';
import { addUniversity, updateUniversity } from '../lib/api';

interface UniversityFormProps {
  university?: University | null;
  onSave: (university: University) => void;
  onClose: () => void;
}

const UniversityForm = ({ university, onSave, onClose }: UniversityFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (university) {
      setFormData({
        name: university.name,
      });
    }
  }, [university]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let savedUniversity: University;
      if (university) {
        // Editing existing university
        savedUniversity = await updateUniversity({ ...formData, id: university.id });
      } else {
        // Adding new university
        savedUniversity = await addUniversity(formData);
      }
      onSave(savedUniversity); // Update parent state with the API's returned university
    } catch (err: any) {
      setError(err.message || 'Failed to save university.');
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
              <h5 className="modal-title">{university ? 'Edit University' : 'Add University'}</h5>
              <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">University Name</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isLoading} />
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

export default UniversityForm;
