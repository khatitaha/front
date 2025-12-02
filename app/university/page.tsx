'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getUniversities, deleteUniversity } from '../../lib/api';
import type { University } from '../../lib/data';
import UniversityForm from '../../components/UniversityForm';

const UniversitiesPage = () => {
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [displayUniversities, setDisplayUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);

  const filterUniversities = useCallback((universities: University[], term: string) => {
    return universities.filter(university =>
      university.name.toLowerCase().includes(term.toLowerCase())
    );
  }, []);

  const refreshUniversities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const universitiesData = await getUniversities();
      setAllUniversities(universitiesData);
    } catch (err) {
      setError('Failed to load universities. Please make sure the API gateway is running and properly configured.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUniversities();
  }, [refreshUniversities]);

  useEffect(() => {
    setDisplayUniversities(filterUniversities(allUniversities, searchTerm));
  }, [searchTerm, allUniversities, filterUniversities]);

  const handleAdd = () => {
    setEditingUniversity(null);
    setIsModalOpen(true);
  };

  const handleEdit = (university: University) => {
    setEditingUniversity(university);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (universityId: number) => {
    if (confirm('Are you sure you want to delete this university?')) {
      try {
        await deleteUniversity(universityId);
        setAllUniversities(prev => prev.filter(u => u.id !== universityId)); // Optimistic update
      } catch (err) {
        setError('Failed to delete university.');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUniversity(null);
  };

  const handleSaveUniversity = (university: University) => {
    if (editingUniversity) {
      setAllUniversities(allUniversities.map(u => u.id === university.id ? university : u));
    } else {
      setAllUniversities([...allUniversities, university]);
    }
    handleCloseModal();
  };

  if (isLoading) {
    return <div>Loading universities...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      {isModalOpen && (
        <UniversityForm 
          university={editingUniversity}
          onSave={handleSaveUniversity}
          onClose={handleCloseModal}
        />
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Universities</h1>
        <button className="btn btn-primary" onClick={handleAdd}>Add University</button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>University Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayUniversities.map((university) => (
            <tr key={university.id}>
              <td>{university.name}</td>
              <td>
                <Link href={`/university/${university.id}`} className="btn btn-sm btn-outline-info me-2">View</Link>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(university)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(university.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UniversitiesPage;
