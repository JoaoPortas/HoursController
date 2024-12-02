import React, { FormEvent, useEffect } from 'react'

const ProfileDataSettings: React.FC = () => {
    async function loadUserData() {
        const nameElment:HTMLInputElement = document.getElementById("name") as HTMLInputElement
        const personalIdElment:HTMLInputElement = document.getElementById("number") as HTMLInputElement
        const categoryElment:HTMLInputElement = document.getElementById("category") as HTMLInputElement
        const workerFunctionElment:HTMLInputElement = document.getElementById("function") as HTMLInputElement

        nameElment.value = "Teste";
        personalIdElment.value = "1";
        categoryElment.value = "2";
        workerFunctionElment.value = "3";
    }

    async function updateUser(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form: HTMLFormElement = event.target as HTMLFormElement;

        const name:string = (form.elements.namedItem("name") as HTMLInputElement).value
        const personalId:string = (form.elements.namedItem("number") as HTMLInputElement).value
        const category:string = (form.elements.namedItem("category") as HTMLInputElement).value
        const workerFunction:string = (form.elements.namedItem("function") as HTMLInputElement).value

        alert(123);
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
        loadUserData();
    }, []);

    return (
        <main>
            <div style={{width: "60%", minWidth: "300px", maxWidth: "700px"}}>
                <form id="updateUserForm" className="needs-validation" onSubmit={updateUser} noValidate>
                    <div className="mb-3">
                        <h1 style={{marginBottom: "30px"}}>Atualizar Informações</h1>
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
                    <div className="row mb-3">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8 d-flex justify-content-end">
                            <button id="updateUserBtn" type="submit" className="btn btn-primary w-100">Atualizar</button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default ProfileDataSettings