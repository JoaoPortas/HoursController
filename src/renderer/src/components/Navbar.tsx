import { RootState } from "@renderer/redux/store"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const Navbar: React.FC = () => {
    //const userId: number | null = useSelector((state: RootState) => state.userSession.userId)
    const name: string | null = useSelector((state: RootState) => state.userSession.name)

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">EHours</Link>
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
                <Link className="nav-link active" aria-current="page" to="/dashboard">Home</Link>
              </li>
              {/*<li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>*/}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Controlo de Horas
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/hoursControl/hoursRegist">Registar Horas</Link></li>
                  <li><Link className="dropdown-item" to="/hoursManagement/registeredHours">Consulta de Horas</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/hoursManagement/export">Exportar Documento</Link></li>
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
                  {name}
                </a>

                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <Link className="dropdown-item" to="/dashboard">Gerir informações</Link>
                  <Link className="dropdown-item" to="/dashboard">Definições</Link>
                  <Link className="dropdown-item" to="/dashboard">Sair</Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
