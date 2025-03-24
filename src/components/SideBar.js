import React, { useContext } from 'react';
import { Dropdown, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Sun, Moon, Plus } from 'react-bootstrap-icons';
import { ThemeContext } from '../theme/ThemeProvider'; 

const SideBar = ({ handleLogout, user, setShowModal }) => {
    const { theme, toggleTheme } = useContext(ThemeContext); 

    return (
        <div className="d-flex flex-md-column justify-content-between h-100 p-2 p-md-3 align-items-center">
            {/* Navegación */}
            <ul className="nav nav-pills flex-md-column">
                <li className="my-2 mx-2 mx-md-0">
                    <Button className="link ms-auto ms-lg-0 btn-sidebar" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun color="gold" size={16} /> : <Moon color="silver" size={16} />}
                    </Button>
                </li>
                <li className="my-2 mx-2 mx-md-0">
                    <Button className="link ms-auto ms-lg-0 btn-sidebar" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun color="gold" size={16} /> : <Moon color="silver" size={16} />}
                    </Button>
                </li>
                <li className="my-2 mx-2 mx-md-0">
                    <Button className="link ms-auto ms-lg-0 btn-sidebar" onClick={() => setShowModal(true)}>
                        <Plus color="green" size={20} />
                    </Button>
                </li>
            </ul>

            {/* Dropdown Usuario */}
            <Dropdown className="">
                <Dropdown.Toggle id="dropdown-user" className="p-0 border-0 btn-sidebar">
                    <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.16006 9.87C8.06006 9.86 7.94006 9.86 7.83006 9.87C5.45006 9.79 3.56006 7.84 3.56006 5.44C3.56006 2.99 5.54006 1 8.00006 1C10.4501 1 12.4401 2.99 12.4401 5.44C12.4301 7.84 10.5401 9.79 8.16006 9.87Z" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.16021 13.56C0.740215 15.18 0.740215 17.82 3.16021 19.43C5.91021 21.27 10.4202 21.27 13.1702 19.43C15.5902 17.81 15.5902 15.17 13.1702 13.56C10.4302 11.73 5.92021 11.73 3.16021 13.56Z" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#">Nuevo proyecto...</Dropdown.Item>
                    <Dropdown.Item href="#">Configuración</Dropdown.Item>
                    <Dropdown.Item href="#">Perfil</Dropdown.Item>
                    <Dropdown.Divider />
                    <Button variant="light" className="w-100 text-start p-2" onClick={handleLogout} >
                    Cerrar sesión
                    </Button>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
  };
  
  export default SideBar;