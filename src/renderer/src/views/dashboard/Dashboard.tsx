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
        const data: IExtraHoursResume[] | null = await window.electron.ipcRenderer.invoke("/hoursManagement/getUserAllExtraHoursResumeByYear", userId, new Date().getFullYear().toString()) as IExtraHoursResume[];
        console.log(data)

        let total: number = 0

        data.forEach((elm: IExtraHoursResume) => {
            total += elm.extraHours
        })
        console.log(total)
        setTotalHours(total)
    }

    useEffect(() => {
        test()

        const updateProgressBars = () => {
            document.querySelectorAll('.progress').forEach((element) => {
              const value = totalHours.toString(); // Convert totalHours to string
              if (value) {
                const progressValue = parseInt(value, 10);
                const left = element.querySelector('.progress-left .progress-bar') as HTMLElement;
                const right = element.querySelector('.progress-right .progress-bar') as HTMLElement;

                // Set initial state
                right.style.transform = `rotate(0deg)`;
                left.style.transform = `rotate(0deg)`;

                // Trigger animation after initial render
                setTimeout(() => {
                  if (progressValue > 0) {
                    if (progressValue <= 50) {
                      right.style.transform = `rotate(${percentageToDegrees(progressValue)}deg)`;
                    } else {
                      right.style.transform = `rotate(180deg)`;
                      left.style.transform = `rotate(${percentageToDegrees(progressValue - 50)}deg)`;
                    }
                  }
                }, 100); // Adjust the delay as needed
              }
            });
          };

          // Ensure updateProgressBars runs after the document is fully loaded
    if (document.readyState === 'complete') {
        updateProgressBars();
      } else {
        window.addEventListener('load', updateProgressBars);
        return () => window.removeEventListener('load', updateProgressBars);
      }
      }, [test]);

      const percentageToDegrees = (percentage: number): number => {
        return (percentage / 100) * 360;
      };

    return (
        <>
            <main>
                <h1>Dashboard</h1>
                {userId && <p>Logged in as user ID: {userId}</p>}
                <div className="container text-center">
                    <div className="row g-2">
                        <div className="col-6">
                            <div className="p-3 gradient-border">
                                <div className="col">
                                    <div style={{display: "inline-flex"}}>Horas extra totais (2024): {totalHours} <div style={{fontSize: "0.875em", color: "#6c757d"}}><span style={{verticalAlign: "middle", marginLeft: "5px"}}>/100 horas</span></div></div>
                                </div>
                                <div style={{marginTop: "15px"}} className="col">
                                    <div className="progress mx-auto" data-value="14">
                                        <span className="progress-left">
                                            <span className="progress-bar border-primary"></span>
                                        </span>
                                        <span className="progress-right">
                                            <span className="progress-bar border-primary"></span>
                                        </span>
                                        <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                                            <div className="h2 font-weight-bold">
                                            {totalHours/1}<sup className="small">%</sup>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="p-3">Custom column padding</div>
                        </div>
                        <div className="col-6">
                            <div className="p-3">Custom column padding</div>
                        </div>
                        <div className="col-6">
                            <div className="p-3">Custom column padding</div>
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
    )
};

export default Dashboard;
