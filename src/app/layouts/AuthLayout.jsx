import Navbar from "../../shared/components/Navbar.jsx";

export default function AuthLayout({ children }) {
  return (
    <div className="page page--auth">
      <Navbar variant="auth" />
      <main className="main main--center">{children}</main>
    </div>
  );
}
