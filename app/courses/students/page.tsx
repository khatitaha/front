"use client"


import { useEffect, useState } from 'react';

interface Course {
  id: string;
  name: string;
  category: string;
  schedule: string;
  students: Student[];
}

interface Student {
  id: string;
  name: string;
  address: string;
  university: {
    id: string;
    name: string;
  };
}

const CoursesWithStudents = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              {
                allCourses {
                  id
                  name
                  category
                  schedule
                }
                allStudents {
                  id
                  name
                  address
                  university {
                    id
                    name
                  }
                }
              }
            `,
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors.map((e: any) => e.message).join(', '));
        }

        const { allCourses, allStudents } = result.data;

        // Randomly assign students to courses
        const coursesWithStudents = allCourses.map((course: Omit<Course, 'students'>) => {
          const students: Student[] = [];
          const numStudents = Math.floor(Math.random() * (allStudents.length + 1));
          const shuffledStudents = [...allStudents].sort(() => 0.5 - Math.random());
          for (let i = 0; i < numStudents; i++) {
            students.push(shuffledStudents[i]);
          }
          return { ...course, students };
        });

        setCourses(coursesWithStudents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Courses and Enrolled Students</h1>
      {courses.map((course) => (
        <div key={course.id} className="mb-8 p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">{course.name}</h2>
          <p className="text-gray-600">{course.category} - {course.schedule}</p>
          <h3 className="text-lg font-medium mt-4">Enrolled Students:</h3>
          {course.students.length > 0 ? (
            <ul className="list-disc list-inside mt-2">
              {course.students.map((student) => (
                <li key={student.id} className="text-gray-700">
                  {student.name} - {student.university.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No students enrolled.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CoursesWithStudents;
