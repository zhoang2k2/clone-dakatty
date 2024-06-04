import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import NavbarRoutes from "../routes/NavbarRoutes";
import "../components/Body/content-body.scss";

function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="content-container">
        <div className="content-body">
          <NavbarRoutes />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
