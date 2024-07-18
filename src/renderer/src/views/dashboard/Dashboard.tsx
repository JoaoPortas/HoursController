import { RootState } from "@renderer/redux/store";
import { IExtraHoursResume } from "@shared/models/hours/interfaces/extraHoursResume.interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
    const userId = useSelector((state: RootState) => state.userSession.userId)
    const [totalHours, setTotalHours] = useState(0)
    const [currentMonth, _setCurrentMonth] = useState<string>(
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    );

    async function test() {
        const data: IExtraHoursResume[] | null = await window.electron.ipcRenderer.invoke("/hoursManagement/getUserAllExtraHoursResumeByYearAndMonth", userId, new Date().getFullYear().toString(), currentMonth) as IExtraHoursResume[];
        console.log(data)

        let total: number = 0

        data.forEach((elm: IExtraHoursResume) => {
            total += elm.extraHours
        })
        console.log(total)
        setTotalHours(total)
    }

    useEffect(() => {
        document.querySelectorAll('.progress').forEach((element) => {
          const value = element.getAttribute('data-value');
          if (value) {
            const progressValue = parseInt(value, 10);
            const left = element.querySelector('.progress-left .progress-bar') as HTMLElement;
            const right = element.querySelector('.progress-right .progress-bar') as HTMLElement;

            if (progressValue > 0) {
              if (progressValue <= 50) {
                right.style.transform = `rotate(${percentageToDegrees(progressValue)}deg)`;
              } else {
                right.style.transform = `rotate(180deg)`;
                left.style.transform = `rotate(${percentageToDegrees(progressValue - 50)}deg)`;
              }
            }
          }
        });
      }, []);

      const percentageToDegrees = (percentage: number): number => {
        return (percentage / 100) * 360;
      };

    test()

    return (
        <>
            <main>
                <h1>Dashboard</h1>
                {userId && <p>Logged in as user ID: {userId}</p>}
                <div className="row">
                    <div className="col-sm-6">
                        <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Special title treatment</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            <a href="#" className="btn btn-primary">Go somewhere</a>
                        </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="card">
                        <div className="card-body">
                        <div className="bg-white rounded-lg p-5 shadow">
                    <div className="row">
                        <div className="col">
                            <h6>Horas feitas no mês de Julho: </h6> {totalHours}
                        </div>
                        <div className="col">
                            <div className="progress mx-auto" data-value='70'>
                                <span className="progress-left">
                                    <span className="progress-bar border-primary"></span>
                                </span>
                                <span className="progress-right">
                                    <span className="progress-bar border-primary"></span>
                                </span>
                                <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                                    <div className="h2 font-weight-bold">80<sup className="small">%</sup></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                        </div>
                        </div>
                    </div>
                </div>

                <br />
                {/*<div className="container">
                    <div className="row">
                        <div className="col-xl-3 col-lg-6 mb-4">
                            <div className="bg-white rounded-lg p-5 shadow">
                                <h2 className="h6 font-weight-bold text-center mb-4">Overall progress</h2>
                                <div className="progress mx-auto" data-value='70'>
                                <span className="progress-left">
                                    <span className="progress-bar border-primary"></span>
                                </span>
                                <span className="progress-right">
                                    <span className="progress-bar border-primary"></span>
                                </span>
                                <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                                    <div className="h2 font-weight-bold">80<sup className="small">%</sup></div>
                                </div>
                                </div>
                                <div className="row text-center mt-4">
                                <div className="col-6 border-right">
                                    <div className="h4 font-weight-bold mb-0">28%</div><span className="small text-gray">Last week</span>
                                </div>
                                <div className="col-6">
                                    <div className="h4 font-weight-bold mb-0">60%</div><span className="small text-gray">Last month</span>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>*/}
                <Link to="/">Go to /</Link>
            </main>
        </>
    );
};

export default Dashboard;
