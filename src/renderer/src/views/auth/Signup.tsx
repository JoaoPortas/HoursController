import React, { CSSProperties, FocusEvent, FormEvent, useEffect, useState } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";

//import styles from "@renderer/public/css/Login.module.css"

//import { setupUsers } from "@renderer/repository/setup.repository";
import { UserRegist } from '@shared/models/auth.model';
import { toast } from "react-toastify";

const Signup: React.FC = () => {
    const errorStyle: CSSProperties = {
        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 12 12\' width=\'12\' height=\'12\' fill=\'none\' stroke=\'%23dc3545\'%3e%3ccircle cx=\'6\' cy=\'6\' r=\'4.5\'/%3e%3cpath stroke-linejoin=\'round\' d=\'M5.8 3.6h.4L6 6.5z\'/%3e%3ccircle cx=\'6\' cy=\'8.2\' r=\'.6\' fill=\'%23dc3545\' stroke=\'none\'/%3e%3c/svg%3e")',
        borderColor: 'var(--bs-form-invalid-border-color)',
        paddingRight: 'calc(1.5em + .75rem)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right calc(.375em + .1875rem) center',
        backgroundSize: 'calc(.75em + .375rem) calc(.75em + .375rem)'
    };

    const navigate: NavigateFunction = useNavigate()

    const [isDisabled, setIsDisabled] = useState(false)
    const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false)

    /*async function testDB() {
        const result = await window.electron.ipcRenderer.invoke("/users/getAll");
        console.log(result)
    }*/

    async function createUser(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setIsDisabled(true)

        const form: HTMLFormElement = event.target as HTMLFormElement;

        const name:string = (form.elements.namedItem("name") as HTMLInputElement).value

        const username:string = (form.elements.namedItem("username") as HTMLInputElement).value

        const checkUsername: boolean = await window.electron.ipcRenderer.invoke("/users/checkUsername", username) as boolean
        if (checkUsername) {
            setUsernameAlreadyExists(true);
            setIsDisabled(false)
            return;
        }

        const password:string = (form.elements.namedItem("password") as HTMLInputElement).value
        const personalId:string = (form.elements.namedItem("number") as HTMLInputElement).value
        const category:string = (form.elements.namedItem("category") as HTMLInputElement).value
        const workerFunction:string = (form.elements.namedItem("function") as HTMLInputElement).value

        const newUser: UserRegist = new UserRegist(username, password, personalId, name, category, workerFunction)

        try {
            const response: UserRegist | null = await toast.promise(
                window.electron.ipcRenderer.invoke("/users/create", newUser) as Promise<UserRegist | null>,
                {
                  pending: 'A criar utilizador...',
                  success: 'Utilizador criado! Proceda à autenticação',
                  error: 'Erro ao criar utilizador'
                }
            );
            console.log(response)

            if (response) {
                navigate("/signin")
            }
        }
        catch (error) {
            console.error("Error creating user:", error);
            setIsDisabled(false)
        }
    }

    async function checkTypedUsername(event: FocusEvent<HTMLInputElement>) {
        const input: HTMLInputElement = event.target as HTMLInputElement

        const username: string = input.value

        const result: boolean = await window.electron.ipcRenderer.invoke("/users/checkUsername", username) as boolean

        console.log(result)
        /*if (!result)
            setIsUsernameValid(false)*/
    }

    async function resetUserAlreadyExists() {
        if (usernameAlreadyExists) {
            setUsernameAlreadyExists(false)
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
    }, []);

    return (
        <main>
            <div style={{margin: "50px auto auto auto", width: "60%", minWidth: "300px", maxWidth: "700px"}}>
                <form id="signupForm" className="needs-validation" onSubmit={createUser} noValidate>
                    <div className="mb-3" style={{textAlign: "center"}}>
                        <h1 style={{marginBottom: "30px"}}>Novo utilizador</h1>
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
                        <label htmlFor="username" className="col-sm-4 col-form-label">Nome de utilizador*</label>
                        <div className="col-sm-8">
                            <input onChange={resetUserAlreadyExists} style={usernameAlreadyExists ? errorStyle : {}} className={`form-control ${usernameAlreadyExists ? "is-invalid" : ""}`} id="username" name="username" onBlur={checkTypedUsername} required/>
                            <div className="invalid-feedback">
                                {usernameAlreadyExists ? "O nome de utilizador já existe" : "*Campo de preenchimento obrigatório"}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-4 col-form-label">Código de acesso*</label>
                        <div className="col-sm-8">
                            <input type="password" className="form-control" id="password" name="password" required/>
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
                    <Link to="/signin">Autenticação</Link>
                    <div className="row mb-3">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8 d-flex justify-content-end">
                            <button id="createUserBtn" type="submit" className="btn btn-primary w-100" disabled={isDisabled}>Registar Utilizador</button>
                        </div>
                    </div>
                    {/*<div className="row mb-3">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8 d-flex justify-content-end">
                            <button type="button" onClick={testDB} className="btn btn-primary w-100">Testar</button>
                        </div>
                    </div>*/}
                </form>
            </div>
        </main>
    );
};

export default Signup
