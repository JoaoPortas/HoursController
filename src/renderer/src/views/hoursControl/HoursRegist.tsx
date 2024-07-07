import { RootState } from "@renderer/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HoursRegist: React.FC = () => {
    const userId = useSelector((state: RootState) => state.userSession.userId)

    return (
        <>
            <main>
                <h1>Registo de horas</h1>
                {userId && <p>Logged in as user ID: {userId}</p>}
                <Link to="/dashboard">Go to /dashboard</Link>
            </main>
        </>
    );
};

export default HoursRegist;
