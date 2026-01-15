/** Footer component. */

export default function Footer() {
  /** Render footer. */
  return (
    <footer className="footer">
      <div className="footer__left">© {new Date().getFullYear()} MailOps</div>

      <div className="footer__right">
        <a className="iconBtn" href="https://instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a className="iconBtn" href="tel:+550000000000">
          Telefone
        </a>
      </div>
    </footer>
  );
}
