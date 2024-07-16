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
    const [years, setYears] = useState<number[]>([]);
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);

    useEffect(() => {
        const fetchData = async () => {
            const data: UserExtraHoursViewModel | null = await window.electron.ipcRenderer.invoke("/hoursManagement/getUserExtraHours", 1) as UserExtraHoursViewModel;
            setExtraHours(data);
        };
        fetchData();

        // Generate years from 2023 to current year
        const currentYear = new Date().getFullYear();
        const yearsArray: number[] = [];
        for (let year = currentYear; year >= 2023; year--) {
            yearsArray.push(year);
        }
        setYears(yearsArray);
    }, []);

    return (
        <>
            <main>
                <h1>Horas registadas</h1>
                <form style={{marginTop: '20px', marginBottom: '20px'}} className="row row-cols-lg-auto g-3 align-items-center">
                    <div className="col-12">
                        <label className="visually-hidden">Ano</label>
                        <select className="form-select" id="year">
                            <option disabled>Ano</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12">
                        <label className="visually-hidden">Preference</label>
                        <select className="form-select" id="month" defaultValue={currentMonth}>
                            <option disabled>Mês</option>
                            <option value="1">Janeiro</option>
                            <option value="2">Fevereiro</option>
                            <option value="3">Março</option>
                            <option value="4">Abril</option>
                            <option value="5">Maio</option>
                            <option value="6">Junho</option>
                            <option value="7">Julho</option>
                            <option value="8">Agosto</option>
                            <option value="9">Setembro</option>
                            <option value="10">Outubro</option>
                            <option value="11">Novembro</option>
                            <option value="12">Dezembro</option>
                        </select>
                    </div>

                    <div className="col-12">
                        <button type="button" className="btn btn-primary">Procurar</button>
                    </div>
                </form>
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
