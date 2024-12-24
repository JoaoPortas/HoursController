import React from 'react'

const Disclaimer: React.FC = () => {
    return (
        <>
            <div style={{padding: "15px", textJustify: "inter-word", textAlign: "justify"}}>
                <h4>Aviso de Isenção de Responsabilidade</h4>
                <p>A plataforma EHours não está associada a qualquer entidade e foi desenvolvida de forma independente.
                    Esta plataforma não possui qualquer fim lucrativo, pelo que não pode ser utilizada para fins comerciais ou geradores de receita.</p>
                <h4>Privacidade e Armazenamento de Dados</h4>
                <p>
                A plataforma EHours armazena todos os dados localmente, no dispositivo do utilizador, junto à aplicação, não havendo qualquer transmissão de informações para servidores externos.
                Este modelo assegura que os dados permanecem no controlo exclusivo do utilizador.</p>
            </div>

            <div style={{width: "100%", position: "absolute", bottom: "60px"}}>
                <div style={{display: "flex", flexDirection: "column", textAlign: "center", color: "#555555"}}>
                    <span>Developed by JPortas</span>
                    <span>05/12/2024</span>
                </div>
            </div>
        </>
    )
}

export default Disclaimer
