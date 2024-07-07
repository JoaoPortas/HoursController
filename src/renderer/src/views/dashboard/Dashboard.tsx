import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
    return (
        <main>
            <h1>Dashboard</h1>
            <Link to="/">Go to /</Link>
        </main>
    );
};

export default Dashboard;
