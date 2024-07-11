import { RootState } from "@renderer/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const HoursRegist: React.FC = () => {
    const userId = useSelector((state: RootState) => state.userSession.userId)

    return (
        <>
            <main>
                <h1>Registo de horas</h1>
                <div style={{width: "60%", minWidth: "300px", maxWidth: "700px"}}>
                <form id="loginForm" className="needs-validation" noValidate>
                    <h4>Data</h4>
                    <div className="row mb-3">
                        <label htmlFor="username" className="col-sm-4 col-form-label">Data</label>
                        <div className="col-sm-8">
                            <input type="date" className="form-control" id="username" name="username" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <h4>Manhã</h4>
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-4 col-form-label">Início</label>
                        <div className="col-sm-8">
                            <input type="time" className="form-control" id="password" name="password" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-4 col-form-label">Fim</label>
                        <div className="col-sm-8">
                            <input type="time" className="form-control" id="password" name="password" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <h4>Tarde</h4>
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-4 col-form-label">Horas extra</label>
                        <div className="col-sm-8">
                            <input type="time" className="form-control" id="password" name="password" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-4 col-form-label">Fim</label>
                        <div className="col-sm-8">
                            <input type="time" className="form-control" id="password" name="password" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
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
