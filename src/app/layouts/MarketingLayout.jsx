import Navbar from "../../shared/components/Navbar.jsx";
import Footer from "../../shared/components/Footer.jsx";

export default function MarketingLayout({ children }) {
  return (
    <div className="page page--marketing">
      <Navbar />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}
