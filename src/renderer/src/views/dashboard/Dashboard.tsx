import { RootState } from "@renderer/redux/store";
import { IExtraHoursResume } from "@shared/models/hours/interfaces/extraHoursResume.interface";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
    const userId = useSelector((state: RootState) => state.userSession.userId)
    const [currentMonth, _setCurrentMonth] = useState<string>(
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    );

    async function test() {
        const data: IExtraHoursResume[] | null = await window.electron.ipcRenderer.invoke("/hoursManagement/getUserAllExtraHoursResumeByYearAndMonth", 1, "2024", "06") as IExtraHoursResume[];
        console.log(data)
    }

    test()

    return (
        <>
            <main>
                <h1>Dashboard</h1>
                {userId && <p>Logged in as user ID: {userId}</p>}
                <Link to="/">Go to /</Link>
            </main>
        </>
    );
};

export default Dashboard;
