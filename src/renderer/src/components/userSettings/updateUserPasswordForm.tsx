import { RootState } from "@renderer/redux/store";
import React, { FormEvent, useEffect } from "react"
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const UpdatateUserPasswordForm: React.FC = () => {
    const userId: number | null = useSelector((state: RootState) => state.userSession.userId)

    async function updateUserPassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form: HTMLFormElement = event.target as HTMLFormElement;

        const newPassword:string = (form.elements.namedItem("newPassword") as HTMLInputElement).value

        try {
            await toast.promise(
                window.electron.ipcRenderer.invoke("/users/updateUserPasswordByUserID", userId, newPassword) as Promise<boolean>,
                {
                  pending: 'A redefenir código de acesso...',
                  success: 'Novo código de acesso defenido!',
                  error: 'Erro'
                }
            );
        }
        catch (error) {
        }
    }


    useEffect(() => {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms:NodeListOf<HTMLFormElement> = document.querySelectorAll('.needs-validation');

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
    }, []);

    return (
        <form id="updateUserPasswordForm" className="needs-validation" onSubmit={updateUserPassword} noValidate>
            <div className="mb-3">
                <h1 style={{marginBottom: "30px"}}>Segurança</h1>
            </div>
            <div className="row mb-3">
                <label htmlFor="name" className="col-sm-4 col-form-label">Novo Código de Acesso*</label>
                <div className="col-sm-8">
                    <input type="text" className="form-control" id="newPassword" name="newPassword" required/>
                    <div className="invalid-feedback">
                        *Campo de preenchimento obrigatório
                    </div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-sm-4"></div>
                <div className="col-sm-8 d-flex justify-content-end">
                    <button id="updateUserBtn" type="submit" className="btn btn-primary w-100">Redefenir Código de Acesso</button>
                </div>
            </div>
        </form>
    )
}

export default UpdatateUserPasswordForm