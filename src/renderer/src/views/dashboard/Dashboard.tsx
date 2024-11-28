import { RootState } from "@renderer/redux/store";
import { IExtraHoursResume } from "@shared/models/hours/interfaces/extraHoursResume.interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
    const userId = useSelector((state: RootState) => state.userSession.userId)
    const [totalHours, setTotalHours] = useState(0)
    const [currentYear] = useState<string>(new Date().getFullYear().toString());
    /*const [currentMonth, _setCurrentMonth] = useState<string>(
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    );*/
    const [hoursAt25, setHoursAt25] = useState(0)
    const [hoursAt37Dot5, setHoursAt37Dot5] = useState(0)

    const [hoursAt50, setHoursAt50] = useState(0)
    const [hoursAt75, setHoursAt75] = useState(0)

    const [hoursAt50HolyDays, setHoursAt50HolyDays] = useState(0)
    const [hoursAt100HolyDays, setHoursAt100HolyDays] = useState(0)

    // Function to calculate hours and percentages
    async function calculateExtraHoursTiers(hours: IExtraHoursResume[]) {
        let totalHours = 0;
        let hoursFor25 = 0;
        let hoursFor37Dot5 = 0;
        let hoursFor50 = 0;
        let hoursFor75 = 0;
        let hoursFor50HolyDays = 0;
        let hoursFor100HolyDays = 0;

        hours.forEach((elm: IExtraHoursResume) => {
            if (elm.extraHours <= 0) return;

            //Se as horas totais forem menor que zero adiciona a primeira a 25% e vê as restantes para adicionar a 37.5 se continuar <100
            if (totalHours < 100) {
                if (elm.dayTypeID === 1) {
                    hoursFor25 += 1;
                    elm.extraHours -= 1;
                    totalHours += 1;

                    if (elm.extraHours > 0) {
                        //Guarda as horas totais atuais para uma variavel para validar se somar se o resto passa ou não das 100
                        let tempTotalHours = totalHours
                        tempTotalHours += elm.extraHours

                        //Se as horas totais + as restantes não passa dos 100 então adiciona a 37.5
                        if (tempTotalHours <= 100) {
                            hoursFor37Dot5 += elm.extraHours
                        }
                        else { //Se as horas totais + as restantes passa dos 100 então calcula quantas horas n passa dos 100 e guarda numa varriável
                            //E calcula as restantes que passam dos 100 e guarda a 50%

                            //Guarda quantas horas que passaram das 100 para adicionar a 75%
                            let restFor75 = tempTotalHours - 100

                            //Tira as horas que têm que ir para os 75% calculadas anteriormente para obter para a var as horas até as 100 que vão continuar nos 37.5%
                            let restFor37Dot5 = elm.extraHours - restFor75

                            hoursFor37Dot5 += restFor37Dot5
                            hoursFor75 += restFor75

                        }
                        totalHours += elm.extraHours
                    }
                }
                else if (elm.dayTypeID === 2 || elm.dayTypeID === 3) {
                    hoursFor50HolyDays += 1;
                    elm.extraHours -= 1;
                    totalHours += 1;

                    if (elm.extraHours > 0) {
                        //Guarda as horas totais atuais para uma variavel para validar se somar se o resto passa ou não das 100
                        let tempTotalHours = totalHours
                        tempTotalHours += elm.extraHours

                        //Se as horas totais + as restantes não passa dos 100 então adiciona a 37.5
                        if (tempTotalHours <= 100) {
                            hoursFor50HolyDays += elm.extraHours
                        }
                        else { //Se as horas totais + as restantes passa dos 100 então calcula quantas horas n passa dos 100 e guarda numa varriável
                            //E calcula as restantes que passam dos 100 e guarda a 50%

                            //Guarda quantas horas que passaram das 100 para adicionar a 75%
                            let restFor100HolyDays = tempTotalHours - 100

                            //Tira as horas que têm que ir para os 75% calculadas anteriormente para obter para a var as horas até as 100 que vão continuar nos 37.5%
                            let restFor50HolyDays = elm.extraHours - restFor100HolyDays

                            hoursFor50HolyDays += restFor50HolyDays
                            hoursFor100HolyDays += restFor100HolyDays

                        }
                        totalHours += elm.extraHours
                    }
                }
            } //Se as horas totais já forem superiores a 100 então pode se adicionar de acordo com as percentagens 50% para a primeira hora e 75 para as restantes
            else {
                if (elm.dayTypeID === 1) {
                    hoursFor50 += 1;
                    elm.extraHours -= 1;
                    totalHours += 1;

                    hoursFor75 += elm.extraHours
                }
                else if (elm.dayTypeID === 2 || elm.dayTypeID === 3) {
                    hoursFor100HolyDays += elm.extraHours;
                }
            }
        });

        console.log("Total hours: ", totalHours);
        console.log("Hours at 25%: ", hoursFor25);
        console.log("Hours at 37.5%: ", hoursFor37Dot5);
        console.log("Hours at 50%: ", hoursFor50);
        console.log("Hours at 75%: ", hoursFor75);

        console.log("Hours Holy at 50%: ", hoursFor50HolyDays);
        console.log("Hours Holy at 100%: ", hoursFor100HolyDays);

        setHoursAt25(hoursFor25)
        setHoursAt37Dot5(hoursFor37Dot5)
        setHoursAt50(hoursFor50)
        setHoursAt75(hoursFor75)
        setHoursAt50HolyDays(hoursFor50HolyDays);
        setHoursAt100HolyDays(hoursFor100HolyDays);
    }

    useEffect(() => {
        async function getAndSetUserCurrentYearHours() {
            const data: IExtraHoursResume[] | null = await window.electron.ipcRenderer.invoke(
                "/hoursManagement/getUserAllExtraHoursResumeByYear",
                userId,
                new Date().getFullYear().toString()
            ) as IExtraHoursResume[];

            let total: number = 0;
            if (data) {
                data.forEach((elm: IExtraHoursResume) => {
                    total += elm.extraHours;
                });
                setTotalHours(total);
                calculateExtraHoursTiers(data);
            }
        }
        getAndSetUserCurrentYearHours();
    }, [userId]); // Run only when userId changes

    useEffect(() => {
        // Update progress bar based on totalHours
        document.querySelectorAll('.progress').forEach((element) => {
            let value = totalHours.toString();

            if (totalHours > 100) value = "100"

            if (value) {
                const progressValue = parseInt(value, 10);
                const left = element.querySelector('.progress-left .progress-bar') as HTMLElement;
                const right = element.querySelector('.progress-right .progress-bar') as HTMLElement;

                if (progressValue > 0) {
                    if (progressValue <= 50) {
                        right.style.transform = `rotate(${percentageToDegrees(progressValue)}deg)`;
                        left.style.transform = `rotate(0deg)`; // Reset left bar
                    } else {
                        right.style.transform = `rotate(180deg)`;
                        left.style.transform = `rotate(${percentageToDegrees(progressValue - 50)}deg)`;
                    }
                }
            }
        });
    }, [totalHours]);

    const percentageToDegrees = (percentage: number): number => {
        return (percentage / 100) * 360;
    };

    return (
        <>
            <main>
                <h1>Painel de Controlo</h1>
                {userId && <p>Autenticado com o ID de Utilizador: {userId}</p>}
                <div className="container text-center">
                    <div className="row g-2">
                        <div className="col-6">
                            <div style={{height: "194px"}} className="p-3 gradient-border">
                                <div className="col">
                                    <div style={{display: "inline-flex"}}>Horas extra totais ({currentYear}): {totalHours} <div style={{fontSize: "0.875em", color: "#6c757d"}}><span style={{verticalAlign: "middle", marginLeft: "5px"}}>/100 horas</span></div></div>
                                </div>
                                <div style={{marginTop: "25px"}} className="col">
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
                            <div style={{height: "194px"}} className="p-3 gradient-border">
                                <div className="row">
                                    <div className="col">
                                        <div>Horas por categoria ({currentYear})</div>
                                    </div>
                                </div>
                                <div style={{marginTop: "13px", fontSize: "17px"}} className="row">
                                    <div className="col">
                                        <span style={{width: "100px"}} className="badge text-bg-primary">125%: {hoursAt25}</span>
                                        <br />
                                        <span style={{width: "100px"}} className="badge text-bg-info">137.5%: {hoursAt37Dot5}</span>
                                        <br />
                                        <span style={{width: "100px"}} className="badge text-bg-primary">150%: {hoursAt50}</span>
                                        <br />
                                        <span style={{width: "100px"}} className="badge text-bg-info">175%: {hoursAt75}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div style={{height: "194px"}} className="p-3 gradient-border">
                                <div className="row">
                                    <div className="col">
                                        <div>Horas de fins-de-semana e feriados ({currentYear})</div>
                                    </div>
                                </div>
                                <div style={{marginTop: "13px", fontSize: "17px"}} className="row">
                                    <div className="col">
                                        <span style={{width: "100px"}} className="badge text-bg-primary">150%: {hoursAt50HolyDays}</span>
                                        <br/>
                                        <span style={{width: "100px"}} className="badge text-bg-primary">200%: {hoursAt100HolyDays}</span>
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
                {/*<Link to="/">Go to /</Link>*/}
            </main>
        </>
    )
};

export default Dashboard;
