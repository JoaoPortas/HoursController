import React, { FormEvent, useEffect } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";

//import styles from "@renderer/public/css/Login.module.css"

//import { setupUsers } from "@renderer/repository/setup.repository";
import { UserRegist } from '@shared/models/auth.model';

const Signup: React.FC = () => {
    const navigate: NavigateFunction = useNavigate()

    async function testDB() {
        const result = await window.electron.ipcRenderer.invoke("/users/getAll");
        console.log(result)
    }

    async function createUser(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const form: HTMLFormElement = event.target as HTMLFormElement;

        const name:string = (form.elements.namedItem("name") as HTMLInputElement).value
        const username:string = (form.elements.namedItem("username") as HTMLInputElement).value
        const password:string = (form.elements.namedItem("password") as HTMLInputElement).value
        const personalId:string = (form.elements.namedItem("number") as HTMLInputElement).value
        const category:string = (form.elements.namedItem("category") as HTMLInputElement).value
        const workerFunction:string = (form.elements.namedItem("function") as HTMLInputElement).value

        const newUser: UserRegist = new UserRegist(username, password, personalId, name, category, workerFunction)

        try {
            const result: UserRegist | null = await window.electron.ipcRenderer.invoke("/users/create", newUser) as UserRegist | null
            console.log(result)

            if (result) {
                navigate("/signin")
            }
        }
        catch (error) {
            console.error("Error creating user:", error);
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

        /*signupForm.addEventListener('submit', (event: Event) => {
            if ()
        });*/

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
                            <input className="form-control" id="username" name="username" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
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
                            <button type="submit" className="btn btn-primary w-100">Registar Utilizador</button>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8 d-flex justify-content-end">
                            <button type="button" onClick={testDB} className="btn btn-primary w-100">Testar</button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Signup
