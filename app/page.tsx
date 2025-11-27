import Link from 'next/link';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Campus Student Management System.</p>
      
      <div className="row mt-4">
        {/* Students Card */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Manage Students</h5>
              <p className="card-text">View, add, edit, and search for students. Manage their enrollments and university details.</p>
              <Link href="/students" className="btn btn-primary">
                Go to Students
              </Link>
            </div>
          </div>
        </div>

        {/* Courses Card */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Manage Courses</h5>
              <p className="card-text">Browse available courses, manage schedules, and handle student enrollments.</p>
              <Link href="/courses" className="btn btn-primary">
                Go to Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {/* AI Chatbot Card */}
        <div className="col-md-12 mb-4">
          <div className="card text-white bg-secondary">
            <div className="card-body">
              <h5 className="card-title">AI Assistant</h5>
              <p className="card-text">Use the integrated chatbot for quick text translation and summarization. Click the icon at the bottom right to start.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}