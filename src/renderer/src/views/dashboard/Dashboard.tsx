import { RootState } from "@renderer/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
    const userId = useSelector((state: RootState) => state.userSession.userId)

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
              <div className="container-fluid">
                <a className="navbar-brand" href="#">Offcanvas navbar</a>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasNavbar"
                  aria-controls="offcanvasNavbar"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className="offcanvas offcanvas-end"
                  tabIndex={-1}
                  id="offcanvasNavbar"
                  aria-labelledby="offcanvasNavbarLabel"
                >
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Offcanvas</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="offcanvas-body">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                      <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#">Home</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">Link</a>
                      </li>
                      <li className="nav-item dropdown">
                        <a
                          className="nav-link dropdown-toggle"
                          href="#"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Dropdown
                        </a>
                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" href="#">Action</a></li>
                          <li><a className="dropdown-item" href="#">Another action</a></li>
                          <li><hr className="dropdown-divider"/></li>
                          <li><a className="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </li>
                    </ul>
                    {/*<form className="d-flex mt-3 mt-lg-0" role="search">
                      <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                      />
                      <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>*/}
                    <ul className="navbar-nav ml-auto">
                      <li className="nav-item">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                          John Doe
                        </a>

                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                          <a className="dropdown-item dropdown" href="#">Editar informações do documento</a>
                          <a className="dropdown-item" href="#">Definições</a>
                          <a className="dropdown-item" href="#"> Show profile page </a>
                          <a className="dropdown-item" href="#">Sair</a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>
            <main>
                <h1>Dashboard</h1>
                {userId && <p>Logged in as user ID: {userId}</p>}
                <Link to="/">Go to /</Link>
            </main>
        </>
    );
};

export default Dashboard;
