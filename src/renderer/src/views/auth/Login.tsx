import { setUserSession } from "@renderer/redux/features/userSession/userSessionSlice";
import { AppDispatch } from "@renderer/redux/store";
import { UserAuth } from "@shared/models/auth.model";
import { IUserAuth } from "@shared/models/interfaces/userAuth.interface";
import { User } from "@shared/models/user.model";
import React, { CSSProperties, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//import styles from "@renderer/public/css/Login.module.css"

const Login: React.FC = () => {
    const errorStyle: CSSProperties = {
        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 12 12\' width=\'12\' height=\'12\' fill=\'none\' stroke=\'%23dc3545\'%3e%3ccircle cx=\'6\' cy=\'6\' r=\'4.5\'/%3e%3cpath stroke-linejoin=\'round\' d=\'M5.8 3.6h.4L6 6.5z\'/%3e%3ccircle cx=\'6\' cy=\'8.2\' r=\'.6\' fill=\'%23dc3545\' stroke=\'none\'/%3e%3c/svg%3e")',
        borderColor: 'var(--bs-form-invalid-border-color)',
        paddingRight: 'calc(1.5em + .75rem)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right calc(.375em + .1875rem) center',
        backgroundSize: 'calc(.75em + .375rem) calc(.75em + .375rem)'
    };

    const navigate: NavigateFunction = useNavigate()
    const dispatch: AppDispatch = useDispatch()

    const [isDisabled, setIsDisabled] = useState(false)
    const [hasAuthError, setAuthError] = useState(false)

    async function authenticate(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()
        setIsDisabled(true)

        const form: HTMLFormElement = event.target as HTMLFormElement;

        const username:string = (form.elements.namedItem("username") as HTMLInputElement).value
        const password:string = (form.elements.namedItem("password") as HTMLInputElement).value

        const authUser: IUserAuth = new UserAuth(username, password)

        try {
            const response: User | null = await toast.promise(
                window.electron.ipcRenderer.invoke("/users/authenticateUser", authUser) as Promise<User | null>,
                {
                  pending: 'Porfavor aguarde...'
                }
            );

            console.log('res: ', response)
            if (response !== null) {
                dispatch(setUserSession({userId: response.userId, name: username, realName: response.name}))
                toast.success('Autenticação feita com sucesso')
                navigate("/dashboard")
            }
            else {
                setAuthError(true)
                console.log("Username or password is wrong")
                toast.error('Erro ao autenticar: o código de acesso ou o nome de utilizador está errado');
            }
        }
        catch (error) {
            console.error("Error on authenticate user:", error);
            toast.error('Erro ao autenticar');
            setIsDisabled(false)
        }

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

    async function forceLogin() {
        dispatch(setUserSession({userId: 1, name: "Pedro Alves", realName: "DEMO"}))
        toast.warning('Autenticação forçada')
        navigate("/dashboard")
    }

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
                            <input onChange={() => setAuthError(false)} style={hasAuthError ? errorStyle : {}} className="form-control" id="username" name="username" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-4 col-form-label">Código de acesso*</label>
                        <div className="col-sm-8">
                            <input onChange={() => setAuthError(false)} style={hasAuthError ? errorStyle : {}} type="password" className="form-control" id="password" name="password" required/>
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
                    <div className="row mb-3">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8 d-flex justify-content-end">
                            <button onClick={forceLogin} type="button" className="btn btn-primary w-100">Force login</button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;
