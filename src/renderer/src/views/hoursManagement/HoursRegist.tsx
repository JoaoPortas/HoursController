import React, { ChangeEvent, CSSProperties, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";
import { BaseExtraHoursRegist } from "@shared/models/hours/extraHoursRegist.model";
import { useSelector } from "react-redux";
import { RootState } from "@renderer/redux/store";

const verticalCenter: CSSProperties = {
    marginTop: "auto",
    marginBottom: "auto"
}

const HoursRegist: React.FC = () => {
    const [wasValidated, setValidated] = useState(false)
    const [hasHoursError, setHoursError] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [isUpdate, setUpdate] = useState(false)
    const userId: number | null = useSelector((state: RootState) => state.userSession.userId)

    const [morningStartRegisted, setMorningStartRegisted] = useState<string | null>(null)
    const [morningEndRegisted, setMorningEndRegisted] = useState<string | null>(null)
    const [afternoonStartRegisted, setAfternoonStartRegisted] = useState<string | null>(null)
    const [afternoonEndRegisted, setAfternoonEndRegisted] = useState<string | null>(null)

    async function registHours(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        setValidated(true)
        setIsDisabled(true)

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

        let hasFormErrors = false
        let hasHoursErrors = false

        if (dateValue.length <= 0) {
            date.classList.add('is-invalid')
            hasFormErrors = true
        }
        else {
            date.classList.add('is-valid')
            hasFormErrors = false
        }

        if ((morningStartValue.length <= 0 && morningEndValue.length <= 0) && (afternoonStartValue.length <= 0 && afternoonEndValue.length <= 0)) {
            hasHoursErrors = true
            morningStart.classList.add('is-invalid')
            morningEnd.classList.add('is-invalid')
            afternoonStart.classList.add('is-invalid')
            afternoonEnd.classList.add('is-invalid')
        }
        else {
            if (morningStartValue.length > 0 && morningEndValue.length <= 0) {
                morningEnd.classList.add('is-invalid')
                hasHoursErrors = true
            }
            else if (morningStartValue.length <= 0 && morningEndValue.length > 0) {
                morningStart.classList.add('is-invalid')
                hasHoursErrors = true
            }

            if (afternoonStartValue.length > 0 && afternoonEndValue.length <= 0) {
                afternoonEnd.classList.add('is-invalid')
                hasHoursErrors = true
            }
            else if (afternoonStartValue.length <= 0 && afternoonEndValue.length > 0) {
                afternoonStart.classList.add('is-invalid')
                hasHoursErrors = true
            }
        }

        setHoursError(hasHoursErrors)
        if (hasHoursErrors || hasFormErrors) {
            setIsDisabled(false)
            return
        }

        //If is not update then insert
        if (!isUpdate) {
            try {
                if (userId === null) return

                const newExtraHours: IBaseExtraHoursRegist = new BaseExtraHoursRegist(dateValue,
                    userId,
                    morningStartValue === "" ? null : morningStartValue,
                    morningEndValue === "" ? null : morningEndValue,
                    afternoonStartValue === "" ? null : afternoonStartValue,
                    afternoonEndValue === "" ? null : afternoonEndValue, 1)

                const response: IBaseExtraHoursRegist | null = await toast.promise(
                    window.electron.ipcRenderer.invoke("/hoursManagement/create", newExtraHours) as Promise<IBaseExtraHoursRegist | null>,
                    {
                      pending: 'Porfavor aguarde...'
                    }
                );

                //console.log('res: ', response)
                if (response !== null) {
                    toast.success('Horas extra registadas.')
                    setMorningStartRegisted(morningStartValue)
                    setMorningEndRegisted(morningEndValue)
                    setAfternoonStartRegisted(afternoonStartValue)
                    setAfternoonEndRegisted(afternoonEndValue)
                    setUpdate(true)
                }
                else {
                    toast.error('Erro ao registar as horas.');
                }
            }
            catch (error) {
                console.error("Error ao registar as horas: ", error);
                toast.error('Erro ao registar as horas.');
                setIsDisabled(false)
            }
        }
        else {
            //Is update
        }

        setIsDisabled(false)
    }

    async function getRegistedHours(event: ChangeEvent<HTMLInputElement>) {
        const input: HTMLInputElement = event.target as HTMLInputElement
        const value = input.value
        const registedHours: IBaseExtraHoursRegist | null = await window.electron.ipcRenderer.invoke("/hoursManagement/getUserExtraHoursByDate", userId, value) as IBaseExtraHoursRegist | null
        //setMorningStartRegisted("00:00")
        console.log(value)
        console.log(registedHours)

        if (!registedHours) {
            setMorningStartRegisted(null)
            setMorningEndRegisted(null)
            setAfternoonStartRegisted(null)
            setAfternoonEndRegisted(null)
            setUpdate(false)

            return
        }

        if (registedHours.morningStartTime) setMorningStartRegisted(registedHours.morningStartTime)
        if (registedHours.morningEndTime) setMorningEndRegisted(registedHours.morningStartTime)
        if (registedHours.afternoonStartTime) setAfternoonStartRegisted(registedHours.afternoonStartTime)
        if (registedHours.afternoonEndTime) setAfternoonEndRegisted(registedHours.afternoonEndTime)
        setUpdate(true)
    }

    async function handleDateChange(event) {
        clearError(event)
        getRegistedHours(event)
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

    function getTodayDate(): string {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        return formattedDate
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
                            {/*<div className="form-text" id="basic-addon4">Último dia registado: 08/07/2024</div>*/}
                            <input onChange={handleDateChange} type="date" className="form-control" id="date" name="date" value={getTodayDate()} required/>
                            <div className="invalid-feedback">
                                *Campo de preenchimento obrigatório
                            </div>
                        </div>
                    </div>
                    <h4>Manhã</h4>
                    <div className="row mb-3">
                        <label style={verticalCenter} htmlFor="morningStart" className="col-sm-4 col-form-label">Início</label>
                        <div className="col-sm-8">
                            <div className="form-text">Horário guardado: {morningStartRegisted ? morningStartRegisted : 'N/A'}</div>
                            <input type="time" className="form-control" id="morningStart" name="morningStart"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label style={verticalCenter} htmlFor="morningEnd" className="col-sm-4 col-form-label">Fim</label>
                        <div className="col-sm-8">
                            <div className="form-text">Horário guardado: {morningEndRegisted ? morningEndRegisted : 'N/A'}</div>
                            <input type="time" className="form-control" id="morningEnd" name="morningEnd"/>
                        </div>
                    </div>
                    <h4>Tarde</h4>
                    <div className="row mb-3">
                        <label style={verticalCenter} htmlFor="afternoonStart" className="col-sm-4 col-form-label">Início</label>
                        <div className="col-sm-8">
                            <div className="form-text">Horário guardado: {afternoonStartRegisted ? afternoonStartRegisted : 'N/A'}</div>
                            <input type="time" className="form-control" id="afternoonStart" name="afternoonStart"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label style={verticalCenter} htmlFor="afternoonEnd" className="col-sm-4 col-form-label">Fim</label>
                        <div className="col-sm-8">
                            <div className="form-text">Horário guardado: {afternoonEndRegisted ? afternoonEndRegisted : 'N/A'}</div>
                            <input type="time" className="form-control" id="afternoonEnd" name="afternoonEnd"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                            <div style={hasHoursError ? {display: "block"} : {}} className="invalid-feedback">
                                *Preencha as horas na parte da manhã, da tarde ou nas duas
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isDisabled}>{isUpdate ? 'Atualizar horas' : 'Registar'}</button>
                        </div>
                    </div>
                </form>
            </div>
            </main>
        </>
    );
};

export default HoursRegist;
