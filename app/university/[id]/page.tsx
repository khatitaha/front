'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUniversityById } from '../../../lib/api';
import type { University } from '../../../lib/data';
import React from 'react';

const UniversityDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
        const { id } = React.use(params);
  
  const universityId = parseInt(id, 10);
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isNaN(universityId)) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const universityData = await getUniversityById(universityId);
        if (universityData) {
          setUniversity(universityData);
        }
      } catch (error) {
        console.error("Failed to fetch university details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [universityId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!university) {
    return (
      <div>
        <h1>University not found</h1>
        <Link href="/university">Back to Universities</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>University Details</h1>
        <Link href="/university" className="btn btn-outline-secondary">
          Back to Universities List
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>{university.name}</h3>
        </div>
        <div className="card-body">
          <p><strong>ID:</strong> {university.id}</p>
          <p><strong>Name:</strong> {university.name}</p>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetailPage;
