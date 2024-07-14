import React, { ChangeEvent, CSSProperties, FormEvent, useEffect, useState } from "react";

const verticalCenter: CSSProperties = {
    marginTop: "auto",
    marginBottom: "auto"
}

const HoursRegist: React.FC = () => {
    const [wasValidated, setValidated] = useState(false)
    const [hasFormError, setFormError] = useState(false)
    const [hasHoursError, setHoursError] = useState(false)
    //const userId = useSelector((state: RootState) => state.userSession.userId)

    async function registHours(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        setValidated(true)

        const form: HTMLFormElement = event.target as HTMLFormElement

        const date: HTMLInputElement = form.elements.namedItem("date") as HTMLInputElement
        const morningStart: HTMLInputElement = form.elements.namedItem("morningStart") as HTMLInputElement
        const morningEnd: HTMLInputElement = form.elements.namedItem("morningEnd") as HTMLInputElement
        const afternoonStart: HTMLInputElement = form.elements.namedItem("afternoonStart") as HTMLInputElement
        const afternoonEnd: HTMLInputElement = form.elements.namedItem("afternoonEnd") as HTMLInputElement

        const dateValue: string = date.value
        const morningStartValue: string = morningStart.value
        const morningEndValue: string = morningEnd.value
        const afternoonStartValue: string = afternoonStart.value
        const afternoonEndValue: string = afternoonEnd.value

        if (dateValue.length <= 0) {
            date.classList.add('is-invalid')
            setFormError(true)
        }
        else {
            date.classList.add('is-valid')
            setFormError(false)
        }

        if ((morningStartValue.length <= 0 && morningEndValue.length <= 0) && (afternoonStartValue.length <= 0 && afternoonEndValue.length <= 0)) {
            setHoursError(true)
            morningStart.classList.add('is-invalid')
            morningEnd.classList.add('is-invalid')
            afternoonStart.classList.add('is-invalid')
            afternoonEnd.classList.add('is-invalid')
        }
        else {
            if (morningStartValue.length > 0 && morningEndValue.length <= 0) {
                morningEnd.classList.add('is-invalid')
                setHoursError(true)
            }
            else if (morningStartValue.length <= 0 && morningEndValue.length > 0) {
                morningStart.classList.add('is-invalid')
                setHoursError(true)
            }

            if (afternoonStartValue.length > 0 && afternoonEndValue.length <= 0) {
                afternoonEnd.classList.add('is-invalid')
                setHoursError(true)
            }
            else if (afternoonStartValue.length <= 0 && afternoonEndValue.length > 0) {
                afternoonStart.classList.add('is-invalid')
                setHoursError(true)
            }
        }

        if (hasHoursError || hasFormError) return


    }

    async function clearError(event: ChangeEvent<HTMLInputElement>) {
        const input: HTMLInputElement = event.target as HTMLInputElement
        const value = input.value

        if (wasValidated) {
            if (value.length <= 0) {
                input.classList.add('is-invalid')
                input.classList.remove('is-valid')
            }
            else {
                input.classList.remove('is-invalid')
                input.classList.add('is-valid')
            }
        }
    }

    useEffect(() => {
        const morningStart: HTMLInputElement = document.getElementById("morningStart") as HTMLInputElement
        const morningEnd: HTMLInputElement = document.getElementById("morningEnd") as HTMLInputElement
        const afternoonStart: HTMLInputElement = document.getElementById("afternoonStart") as HTMLInputElement
        const afternoonEnd: HTMLInputElement = document.getElementById("afternoonEnd") as HTMLInputElement
        //console.log(morningStart)

        async function clearHoursError() {
            let hasError = false
            if (wasValidated) {
                if (morningStart.value.length > 0 && morningEnd.value.length <= 0) {
                    morningEnd.classList.add('is-invalid')
                    morningEnd.classList.remove('is-valid')
                    hasError = true
                }
                else {
                    morningEnd.classList.add('is-valid')
                    morningEnd.classList.remove('is-invalid')
                }

                if (morningStart.value.length <= 0 && morningEnd.value.length > 0) {
                    morningStart.classList.add('is-invalid')
                    morningStart.classList.remove('is-valid')
                    hasError = true
                }
                else {
                    morningStart.classList.add('is-valid')
                    morningStart.classList.remove('is-invalid')
                }

                if (afternoonStart.value.length > 0 && afternoonEnd.value.length <= 0) {
                    afternoonEnd.classList.add('is-invalid')
                    afternoonEnd.classList.remove('is-valid')
                    hasError = true
                }
                else {
                    afternoonEnd.classList.add('is-valid')
                    afternoonEnd.classList.remove('is-invalid')
                }

                if (afternoonStart.value.length <= 0 && afternoonEnd.value.length > 0) {
                    afternoonStart.classList.add('is-invalid')
                    afternoonStart.classList.remove('is-valid')
                    hasError = true
                }
                else {
                    afternoonStart.classList.add('is-valid')
                    afternoonStart.classList.remove('is-invalid')
                }

                setHoursError(hasError)
            }
        }

        morningStart.addEventListener('change', clearHoursError);
        morningEnd.addEventListener('change', clearHoursError);
        afternoonStart.addEventListener('change', clearHoursError);
        afternoonEnd.addEventListener('change', clearHoursError);

        return () => {
            morningStart.removeEventListener('change', clearHoursError);
            morningEnd.removeEventListener('change', clearHoursError);
            afternoonStart.removeEventListener('change', clearHoursError);
            afternoonEnd.removeEventListener('change', clearHoursError);
        };
    }, [wasValidated]);

    return (
        <>
            <main>
                <h1>Registo de horas</h1>
                <div style={{width: "60%", minWidth: "300px", maxWidth: "700px"}}>
                <form onSubmit={registHours} id="hoursRegistForm" className="needs-validation" noValidate>
                    <h4>Data</h4>
                    <div className="row mb-3">
                        <label style={verticalCenter} htmlFor="date" className="col-sm-4 col-form-label">Data</label>
                        <div className="col-sm-8">
                            <div className="form-text" id="basic-addon4">Último dia registado: 08/07/2024</div>
                            <input onChange={clearError} type="date" className="form-control" id="date" name="date" required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <h4>Manhã</h4>
                    <div className="row mb-3">
                        <label style={verticalCenter} htmlFor="morningStart" className="col-sm-4 col-form-label">Início</label>
                        <div className="col-sm-8">
                            <div className="form-text">Horário guardado: 08:00</div>
                            <input type="time" className="form-control" id="morningStart" name="morningStart"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label style={verticalCenter} htmlFor="morningEnd" className="col-sm-4 col-form-label">Fim</label>
                        <div className="col-sm-8">
                            <div className="form-text">Horário guardado: 09:00</div>
                            <input type="time" className="form-control" id="morningEnd" name="morningEnd"/>
                        </div>
                    </div>
                    <h4>Tarde</h4>
                    <div className="row mb-3">
                        <label style={verticalCenter} htmlFor="afternoonStart" className="col-sm-4 col-form-label">Início</label>
                        <div className="col-sm-8">
                            <div className="form-text">Horário guardado: 17:00</div>
                            <input type="time" className="form-control" id="afternoonStart" name="afternoonStart"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label style={verticalCenter} htmlFor="afternoonEnd" className="col-sm-4 col-form-label">Fim</label>
                        <div className="col-sm-8">
                            <div className="form-text">Horário guardado: 19:00</div>
                            <input type="time" className="form-control" id="afternoonEnd" name="afternoonEnd"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                            <div style={hasHoursError ? {display: "block"} : {}} className="invalid-feedback">
                                *Preencha as horas na parte da manhã, da tarde ou nas duas
                            </div>
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
