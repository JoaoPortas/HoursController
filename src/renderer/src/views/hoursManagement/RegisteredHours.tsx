import { UserExtraHoursViewModel } from "@shared/viewModels/hoursManagement/userExtraHours.viewmodel"

const RegisteredHours: React.FC = () => {
    window.electron.ipcRenderer.invoke("/hoursManagement/getUserExtraHours", 1) as Promise<UserExtraHoursViewModel | null>

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
                    </tbody>
                </table>
            </main>
        </>
    )
}

export default RegisteredHours
