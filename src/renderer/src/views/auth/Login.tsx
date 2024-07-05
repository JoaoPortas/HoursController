import React from "react";
import { Link } from "react-router-dom";

import styles from "@renderer/public/css/Login.module.css"

const Login: React.FC = () => {
    return (
        <main>
            <div style={{margin: "50px auto auto auto", width: "60%", minWidth: "300px", maxWidth: "700px"}}>
                <form>
                    <div className="mb-3" style={{textAlign: "center"}}>
                        <h1 style={{marginBottom: "30px"}}>Autenticação</h1>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="username" className="col-sm-4 col-form-label">Nome de utilizador</label>
                        <div className="col-sm-8">
                            <input type="email" className="form-control" id="username"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-4 col-form-label">Código de acesso</label>
                        <div className="col-sm-8">
                            <input type="password" className="form-control" id="password"/>
                        </div>
                    </div>
                    <Link to="/signup">Novo utilizador</Link>
                    <div className="row mb-3">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8 d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary w-100">Entrar</button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;
