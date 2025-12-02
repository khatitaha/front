'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudents, getUniversities } from '../../lib/api';
import type { Student } from '../../lib/data';
import StudentForm from '../../components/StudentForm';

const StudentsPage = () => {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [displayStudents, setDisplayStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await getStudents();
        setAllStudents(studentsData);
        setDisplayStudents(studentsData);
      } catch (err) {
        setError('Failed to load data. Please make sure the API gateway is running and properly configured.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = allStudents.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayStudents(filtered);
  }, [searchTerm, allStudents]);

  const handleAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (studentId: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId);
        setAllStudents(allStudents.filter(s => s.id !== studentId));
      } catch (error) {
        alert('Failed to delete student.');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSaveStudent = async (student: Student) => {
    try {
      if (editingStudent) {
        const updatedStudent = await updateStudent(student);
        setAllStudents(allStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      } else {
        const newStudent = await addStudent(student);
        setAllStudents([...allStudents, newStudent]);
      }
      handleCloseModal();
    } catch (error) {
      alert('Failed to save student.');
    }
  };

  if (isLoading) {
    return <div>Loading students...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      {isModalOpen && (
        <StudentForm
          student={editingStudent}
          onSave={handleSaveStudent}
          onClose={handleCloseModal}
        />
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Students</h1>
        <button className="btn btn-primary" onClick={handleAdd}>Add Student</button>
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
            <th>Name</th>
            <th>Address</th>
            <th>University</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayStudents.map((student) => (
            <tr key={student.id}>
              <td>
                <Link href={`/students/${student.id}`}>{student.name}</Link>
              </td>
              <td>{student.address}</td>
              <td>{student.university.name || 'Unknown'}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(student)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsPage;