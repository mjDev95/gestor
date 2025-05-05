import React, { useContext, useState } from 'react';
import { Dropdown, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Sun, Moon, Plus, GearFill } from 'react-bootstrap-icons';
import { ThemeContext } from '../theme/ThemeProvider'; 
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { usePerfil } from '../context/PerfilContext'; 

const SideBar = ({ setShowModal }) => {
    const { theme, toggleTheme } = useContext(ThemeContext); 
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const { abrirPerfil } = usePerfil();

    const handleLogoutClick = async () => {
        await handleLogout();  
        navigate('/login'); 
    }; 

    return (
        <div className="col-sidebar d-flex flex-md-column justify-content-between vh-100v align-items-center order-1 order-md-0">
            {/* Navegación */}
            <ul className="nav nav-pills flex-row w-100 flex-md-column h-100 justify-content-between">
                
                <li>
                    <Button className="link m-2 m-lg-3 btn-sidebar" onClick={() => setShowModal(true)}>
                        <Plus color="green" size={20} />
                    </Button>
                </li>
                <li className='ms-auto me-0 mb-md-0 mt-md-auto'>
                    <Button className="link m-2 m-lg-3 btn-sidebar" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun color="gold" size={16} /> : <Moon color="silver" size={16} />}
                    </Button>
                </li>
                <li >
                    <Button className="link m-2 m-lg-3 btn-sidebar" onClick={handleLogoutClick}>
                        <GearFill color="green" size={20} />
                    </Button>
                </li>
                <li >
                    <Button className="link m-2 m-lg-3 btn-sidebar" onClick={abrirPerfil}>
                        <GearFill color="green" size={20} />
                    </Button>
                </li>
            </ul>           
        </div>
    );
  };
  
  export default SideBar;