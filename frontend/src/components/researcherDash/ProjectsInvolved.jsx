import React from 'react';

export default function ProjectsInvolved() {
    return (
        <div className="tab-pane-content">
            <h3 className="mb-3">Projects Involved</h3>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item"><button className="nav-link active">Current Participation (2)</button></li>
                <li className="nav-item"><button className="nav-link">Completed (5)</button></li>
            </ul>
            {/* Project List Placeholder */}
            <p>List of projects (Project A - In Progress, Project B - Data Collection).</p>
        </div>
    );
}