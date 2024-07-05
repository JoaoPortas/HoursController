import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "@renderer/public/css/Login.module.css"

const Signup: React.FC = () => {
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
        <main>
            <div style={{margin: "50px auto auto auto", width: "60%", minWidth: "300px", maxWidth: "700px"}}>
                <form className="needs-validation" noValidate>
                    <div className="mb-3" style={{textAlign: "center"}}>
                        <h1 style={{marginBottom: "30px"}}>Novo utilizador</h1>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="name" className="col-sm-4 col-form-label">Nome*</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" id="name" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="username" className="col-sm-4 col-form-label">Nome de utilizador*</label>
                        <div className="col-sm-8">
                            <input className="form-control" id="username" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-4 col-form-label">Código de acesso*</label>
                        <div className="col-sm-8">
                            <input type="password" className="form-control" id="password" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="number" className="col-sm-4 col-form-label">NIP/MÓD.*</label>
                        <div className="col-sm-8">
                            <input className="form-control" id="number" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="category" className="col-sm-4 col-form-label">Categoria/Carreira*</label>
                        <div className="col-sm-8">
                            <input className="form-control" id="category" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="function" className="col-sm-4 col-form-label">Função*</label>
                        <div className="col-sm-8">
                            <input className="form-control" id="function" required/>
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
                </form>
            </div>
        </main>
    );
};

export default Signup
