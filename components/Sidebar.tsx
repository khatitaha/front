import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px', height: '100vh' }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">Campus Management</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link href="/" className="nav-link active" aria-current="page">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/students" className="nav-link text-white">
            Students
          </Link>
        </li>
        <li>
          <Link href="/courses" className="nav-link text-white">
            Courses
          </Link>
        </li>
      </ul>
      <hr />
      <div>
        <strong>NTIC Faculty</strong>
        <br />
        <small>Master 1 - DSI</small>
      </div>
    </div>
  );
};

export default Sidebar;