import { setUserSession } from "@renderer/redux/features/userSession/userSessionSlice";
import { AppDispatch } from "@renderer/redux/store";
import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";

//import styles from "@renderer/public/css/Login.module.css"

const Login: React.FC = () => {
    const navigate: NavigateFunction = useNavigate()
    const dispatch: AppDispatch = useDispatch()

    const [isDisabled, setIsDisabled] = useState(false)

    async function authenticate(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()
        setIsDisabled(true)

        const form: HTMLFormElement = event.target as HTMLFormElement;

        const username:string = (form.elements.namedItem("username") as HTMLInputElement).value
        const password:string = (form.elements.namedItem("password") as HTMLInputElement).value

        dispatch(setUserSession(101))
        //Check login and store the user id logged
        navigate("/dashboard")

        setIsDisabled(false)
    }

    useEffect(() => {
        const loginForm: HTMLFormElement = document.getElementById('loginForm') as HTMLFormElement

        loginForm.addEventListener('submit', event => {
            if (!loginForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            loginForm.classList.add('was-validated');
        })
    }, []);

    return (
        <main>
            <div style={{margin: "50px auto auto auto", width: "60%", minWidth: "300px", maxWidth: "700px"}}>
                <form id="loginForm" onSubmit={authenticate} className="needs-validation" noValidate>
                    <div className="mb-3" style={{textAlign: "center"}}>
                        <h1 style={{marginBottom: "30px"}}>Autenticação</h1>
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
                    <Link to="/signup">Novo utilizador</Link>
                    <div className="row mb-3">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8 d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary w-100" disabled={isDisabled}>Entrar</button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;
