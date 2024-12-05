import { RootState } from "@renderer/redux/store"
import { useSelector } from "react-redux"
import { toast } from 'react-toastify'
import { IUser } from '@shared/models/interfaces/user.interface'
import { User } from '@shared/models/user.model'
import { FormEvent, useEffect } from "react"

const UserPersonalInfoForm: React.FC = () => {
    const userId = useSelector((state: RootState) => state.userSession.userId)

    async function loadUserData() {
        const nameElment:HTMLInputElement = document.getElementById("name") as HTMLInputElement
        const personalIdElment:HTMLInputElement = document.getElementById("number") as HTMLInputElement
        const categoryElment:HTMLInputElement = document.getElementById("category") as HTMLInputElement
        const workerFunctionElment:HTMLInputElement = document.getElementById("function") as HTMLInputElement

        let userData: IUser = await window.electron.ipcRenderer.invoke("/users/getUserByID", userId) as IUser;

        nameElment.value = userData.name;
        personalIdElment.value = userData.number;
        categoryElment.value = userData.category;
        workerFunctionElment.value = userData.position;
    }

    async function updateUser(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form: HTMLFormElement = event.target as HTMLFormElement;

        const name:string = (form.elements.namedItem("name") as HTMLInputElement).value
        const personalId:string = (form.elements.namedItem("number") as HTMLInputElement).value
        const category:string = (form.elements.namedItem("category") as HTMLInputElement).value
        const workerFunction:string = (form.elements.namedItem("function") as HTMLInputElement).value

        let newUserData:IUser = new User(userId ?? 0, "N/A", personalId, name, category, workerFunction);

        try {
            const response: IUser | null = await toast.promise(
                window.electron.ipcRenderer.invoke("/users/updateUserDataByUserID", userId, newUserData) as Promise<IUser | null>,
                {
                  pending: 'A Atualizar dados...',
                  success: 'Dados atualizados',
                  error: 'Erro ao atualizar dados!'
                }
            );
        }
        catch (error) {
            /*console.error("Error creating user:", error);
            setIsDisabled(false)*/
        }
    }

    useEffect(() => {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms:NodeListOf<HTMLFormElement> = document.querySelectorAll('.needs-validation');
        //let signupForm: HTMLFormElement = document.getElementById('signupForm') as HTMLFormElement ?? null;

        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);
        });
        loadUserData();
    }, []);

    return (
        <form id="updateUserForm" className="needs-validation" onSubmit={updateUser} noValidate>
                    <div className="mb-3">
                        <h1 style={{marginBottom: "30px"}}>Atualizar Informações</h1>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="name" className="col-sm-4 col-form-label">Nome*</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" id="name" name="name" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="number" className="col-sm-4 col-form-label">NIP/MÓD.*</label>
                        <div className="col-sm-8">
                            <input className="form-control" id="number" name="number" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="category" className="col-sm-4 col-form-label">Categoria/Carreira*</label>
                        <div className="col-sm-8">
                            <input className="form-control" id="category" name="category" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="function" className="col-sm-4 col-form-label">Função*</label>
                        <div className="col-sm-8">
                            <input className="form-control" id="function" name="function" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8 d-flex justify-content-end">
                            <button id="updateUserBtn" type="submit" className="btn btn-primary w-100">Atualizar</button>
                        </div>
                    </div>
                </form>
    );
}

export default UserPersonalInfoForm