import React, { useState } from "react";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAuth } from "../auth/AuthContext";

// Example dashboard components for each role
function NonprofitDashboard({ user }) {
  return (
    <div>
      <h2>Welcome Nonprofit!</h2>
      <p>Name: {user.profile?.name || user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add more nonprofit-specific content here */}
    </div>
  );
}

/**RESEARCHER DASHBOARD **/

// Import the modularized components for researcher dashboard
import ProfileSection from "../components/researcherDash/ProfileSection";
import ProjectsInvolved from "../components/researcherDash/ProjectsInvolved";
import TentativeProjects from "../components/researcherDash/TentativeProjects";
import RatingFeedback from "../components/researcherDash/RatingFeedback";

function ResearcherDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("profile");

  // Function to render the active component based on the main state
  const renderMainContent = () => {
    switch (activeTab) {
      case "profile":
        // Pass the user prop down to the ProfileSection
        return <ProfileSection user={user} />;
      case "projects":
        return <ProjectsInvolved />;
      case "tentative":
        return <TentativeProjects />;
      case "rating":
        return <RatingFeedback />;
      default:
        return <ProfileSection user={user} />;
    }
  };
  return (
    <div className="page-root">
      <TopBar />
      <main className="page-content container py-5">
        <h1 className="mb-4">Researcher Dashboard</h1>

        {/* Main Tab Navigation */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile Information
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              Projects Involved
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "tentative" ? "active" : ""
              }`}
              onClick={() => setActiveTab("tentative")}
            >
              Tentative Projects
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "rating" ? "active" : ""}`}
              onClick={() => setActiveTab("rating")}
            >
              Rating & Feedback
            </button>
          </li>
        </ul>
        {/* Main Content Area */}
        <div className="dashboard-content-area">{renderMainContent()}</div>
      </main>
      <Footer />
    </div>
  );
}

function AdminDashboard({ user }) {
  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add more admin-specific content here */}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  // Fallback to localStorage if context is not populated
  let currentUser = user;
  if (!currentUser) {
    try {
      const rawUser = localStorage.getItem("trident_user");
      if (rawUser) currentUser = JSON.parse(rawUser);
    } catch (e) {
      currentUser = null;
    }
  }

  if (!currentUser) {
    return (
      <div className="alert alert-warning">
        You must be logged in to view the dashboard.
      </div>
    );
  }

  switch (currentUser.role) {
    case "nonprofit":
      return <NonprofitDashboard user={currentUser} />;
    case "researcher":
      return <ResearcherDashboard user={currentUser} />;
    case "admin":
      return <AdminDashboard user={currentUser} />;
    default:
      return (
        <div className="alert alert-info">Unknown role: {currentUser.role}</div>
      );
  }
}
