import { RootState } from "@renderer/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HoursRegist: React.FC = () => {
    const userId = useSelector((state: RootState) => state.userSession.userId)

    return (
        <>
            <main>
                <h1>Registo de horas</h1>
                {userId && <p>Logged in as user ID: {userId}</p>}
                <Link to="/dashboard">Go to /dashboard</Link>
                <div style={{margin: "50px auto auto auto", width: "60%", minWidth: "300px", maxWidth: "700px"}}>
                <form id="loginForm" className="needs-validation" noValidate>
                    <div className="mb-3" style={{textAlign: "center"}}>
                        <h1 style={{marginBottom: "30px"}}>Autenticação</h1>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="username" className="col-sm-4 col-form-label">Data</label>
                        <div className="col-sm-8">
                            <input type="date" className="form-control" id="username" name="username" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-4 col-form-label">Horas extra</label>
                        <div className="col-sm-8">
                            <input type="number" className="form-control" id="password" name="password" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <Link to="/signup">Novo utilizador</Link>
                    <div className="row mb-3">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8 d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary w-100">Registar</button>
                        </div>
                    </div>
                </form>
            </div>
            </main>
        </>
    );
};

export default HoursRegist;
