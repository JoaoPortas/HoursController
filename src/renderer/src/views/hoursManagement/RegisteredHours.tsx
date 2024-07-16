import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";
import { UserExtraHoursViewModel } from "@shared/viewModels/hoursManagement/userExtraHours.viewmodel"
import { Fragment, useEffect, useState } from "react";

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthShortNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const month = monthShortNames[date.getMonth()];
    return `${day} ${month}`;
};

const RegisteredHours: React.FC = () => {
    const [extraHours, setExtraHours] = useState<UserExtraHoursViewModel | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data: UserExtraHoursViewModel | null = await window.electron.ipcRenderer.invoke("/hoursManagement/getUserExtraHours", 1) as UserExtraHoursViewModel;
            setExtraHours(data);
        };
        fetchData();
    }, []);

    return (
        <>
            <main>
                <h1>Horas registadas</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <td>NIP/MÓD.</td>
                            <td>Categoria/Carreira</td>
                            <td>Funções</td>
                            <td>Nome</td>
                            <td>Data</td>
                            <td>Início</td>
                            <td>Fim</td>
                        </tr>
                    </thead>
                    <tbody>
                    {extraHours && extraHours.userHours.map((hour: IBaseExtraHoursRegist, index) => (
                        <Fragment key={index}>
                            {hour.morningStartTime && (
                                <tr>
                                    <td>{extraHours.nip}</td>
                                    <td>{extraHours.category}</td>
                                    <td>{extraHours.position}</td>
                                    <td>{extraHours.name}</td>
                                    <td>{formatDate(hour.date)}</td>
                                    <td>{hour.morningStartTime || '-'}</td>
                                    <td>{hour.morningEndTime || '-'}</td>
                                </tr>
                            )}
                            {hour.afternoonStartTime && (
                                <tr>
                                    <td>{extraHours.nip}</td>
                                    <td>{extraHours.category}</td>
                                    <td>{extraHours.position}</td>
                                    <td>{extraHours.name}</td>
                                    <td>{formatDate(hour.date)}</td>
                                    <td>{hour.afternoonStartTime || '-'}</td>
                                    <td>{hour.afternoonEndTime || '-'}</td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                        {/*<tr>
                            <td>XXXXXX-X</td>
                            <td>XXXXXXXX</td>
                            <td>XXXXXXXX</td>
                            <td>Nome Fictício</td>
                            <td>03 Jan</td>
                            <td>08:00</td>
                            <td>09:00</td>
                        </tr>
                        <tr>
                            <td>XXXXXX-X</td>
                            <td>XXXXXXXX</td>
                            <td>XXXXXXXX</td>
                            <td>Nome Fictício</td>
                            <td>03 Jan</td>
                            <td>08:00</td>
                            <td>09:00</td>
                        </tr>
                        <tr>
                            <td>XXXXXX-X</td>
                            <td>XXXXXXXX</td>
                            <td>XXXXXXXX</td>
                            <td>Nome Fictício</td>
                            <td>03 Jan</td>
                            <td>08:00</td>
                            <td>09:00</td>
                        </tr>
                        <tr>
                            <td>XXXXXX-X</td>
                            <td>XXXXXXXX</td>
                            <td>XXXXXXXX</td>
                            <td>Nome Fictício</td>
                            <td>03 Jan</td>
                            <td>08:00</td>
                            <td>09:00</td>
                        </tr>
                        <tr>
                            <td>XXXXXX-X</td>
                            <td>XXXXXXXX</td>
                            <td>XXXXXXXX</td>
                            <td>Nome Fictício</td>
                            <td>03 Jan</td>
                            <td>08:00</td>
                            <td>09:00</td>
                        </tr>*/}
                    </tbody>
                </table>
            </main>
        </>
    )
}

export default RegisteredHours
