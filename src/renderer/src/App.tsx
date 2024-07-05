import React from 'react'
import { Link } from "react-router-dom";

const App: React.FC = () => {
    return (
        <>
            <h1>Hello world</h1>
            <Link to="/login">
                login
            </Link>
            <br />
            <Link to="/vite">
                Vite page
            </Link>
        </>
    )
}

export default App
