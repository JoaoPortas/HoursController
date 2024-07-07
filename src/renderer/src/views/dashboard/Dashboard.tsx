import { RootState } from "@renderer/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
    const userId = useSelector((state: RootState) => state.userSession.userId)

    return (
        <main>
            <h1>Dashboard</h1>
            {userId && <p>Logged in as user ID: {userId}</p>}
            <Link to="/">Go to /</Link>
        </main>
    );
};

export default Dashboard;
