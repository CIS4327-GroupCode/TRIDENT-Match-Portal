import React, { useState } from 'react';

// Sub-sub components (could also be defined in this file for simplicity)
const PersonalInfo = ({ user }) => (
    <div>
        <p>Name: <strong>{user.profile?.name || user.name}</strong></p>
        <p>Email: <strong>{user.email}</strong></p>
        <p>Role: <strong>{user.role}</strong></p>
        <button className="btn btn-outline-primary mt-3">Edit Personal Details</button>
    </div>
);

const AcademicInfo = () => (
    <div>
        <p>Institution: Placeholder University</p>
        <p>Degree: Ph.D. in Data Science</p>
        <p>Research Interests: Machine Learning, Public Health</p>
        <button className="btn btn-outline-primary mt-3">Update Academic History</button>
    </div>
);

const Certifications = () => (
    <div>
        <ul className="list-unstyled">
            <li>Ethical Research Certification (2024)</li>
            <li>Data Privacy Compliance (GDPR)</li>
        </ul>
        <button className="btn btn-outline-primary mt-3">Add New Certification</button>
    </div>
);

export default function ProfileSection({ user }) {
    const [profileTab, setProfileTab] = useState('personal');

    const renderProfileContent = () => {
        switch (profileTab) {
            case 'personal':
                return <PersonalInfo user={user} />;
            case 'academic':
                return <AcademicInfo />;
            case 'certifications':
                return <Certifications />;
            default:
                return <PersonalInfo user={user} />;
        }
    };

    return (
        <div className="tab-pane-content">
            <h3 className="mb-3">Profile Information</h3>
            <ul className="nav nav-pills mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${profileTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setProfileTab('personal')}
                    >Personal</button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${profileTab === 'academic' ? 'active' : ''}`}
                        onClick={() => setProfileTab('academic')}
                    >Academic</button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${profileTab === 'certifications' ? 'active' : ''}`}
                        onClick={() => setProfileTab('certifications')}
                    >Certifications</button>
                </li>
            </ul>
            <div className="card p-3">{renderProfileContent()}</div>
        </div>
    );
}