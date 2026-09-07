function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <p>&copy; {year} Trai-Track. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
