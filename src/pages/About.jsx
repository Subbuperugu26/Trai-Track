export default function About() {
  return (
    <>
      <header className="page-header"><h1>About <span>Employee Tracker</span></h1><p>A simple system for employee daily productivity tracking and monitoring.</p></header>
      <main className="page-container">
        <div className="info-grid">
          <div className="info-item"><h2>Purpose</h2><p>Employee Tracker helps record daily work information and organize employee productivity data.</p></div>
          <div className="info-item"><h2>Tracker</h2><p>The Tracker page contains employee details, assignments, hourly work, breaks, image count, and remarks.</p></div>
          <div className="info-item"><h2>Dashboard</h2><p>The Dashboard provides visual performance information from tracker data.</p></div>
          <div className="info-item"><h2>Responsive Design</h2><p>The application is designed to work on desktop, tablet, and mobile phone screens.</p></div>
        </div>
      </main>
    </>
  );
}