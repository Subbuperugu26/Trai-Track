import { Link } from "react-router-dom";

export default function Home() {
  const cards = [
    ["👨‍💼", "Employee Tracker", "Record daily employee work details, assignments, hourly work, breaks, image counts and remarks.", "/tracker"],
    ["📊", "Dashboard", "View productivity statistics, batch performance and the Top 7 employee ranking.", "/dashboard"],
    ["📈", "Reports", "Review employee work information and productivity results.", "/reports"],
    ["ℹ️", "About", "Learn about the Employee Tracker application.", "/about"],
  ];

  return (
    <>
      <header className="home-hero">
        <div className="hero-content">
          <div className="hero-badge">EMPLOYEE PRODUCTIVITY SYSTEM</div>
          <h1>Welcome to <span>Employee Tracker</span></h1>
          <p>A simple and organized workspace for recording employee productivity, monitoring performance, and reviewing daily work information.</p>
        </div>
      </header>

      <main className="home-container">
        <section className="intro-card">
          <h2>Employee Work Management</h2>
          <p>Employee Tracker brings daily work tracking, productivity monitoring, dashboards, and reports together in one place.</p>
        </section>

        <section className="home-pages">
          {cards.map(([icon, title, text, path]) => (
            <article className="home-page-card" key={title}>
              <div className="home-icon">{icon}</div>
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
                <Link to={path}>Open {title} →</Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}