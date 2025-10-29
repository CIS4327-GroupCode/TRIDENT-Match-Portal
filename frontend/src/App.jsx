import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import OrgForm from "./pages/OrgForm";
import NonprofitSignup from "./pages/NonprofitSignup";

export default function App() {
  return (
    <>
      <nav style={styles.nav}>
        <Link style={styles.navLink} to="/">Home</Link>

        {/* This now links to the onboarding intro step */}
        <Link style={styles.navLink} to="/signup/nonprofit">
          Organization Setup
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Step 1: onboarding intro / “what is this” */}
        <Route path="/signup/nonprofit" element={<NonprofitSignup />} />

        {/* Step 2: actual organization profile form */}
        <Route path="/signup/nonprofit/form" element={<OrgForm />} />
      </Routes>
    </>
  );
}

const styles = {
  nav: {
    backgroundColor: "#111827",
    color: "#fff",
    padding: "0.75rem 1rem",
    display: "flex",
    gap: "1rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  navLink: {
    color: "#fff",
    fontSize: "0.9rem",
    textDecoration: "none",
    fontWeight: 500,
  },
};
