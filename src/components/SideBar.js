import React, { useContext } from 'react';
import { Sun, Moon, Plus, GearFill, GridFill, CreditCardFill, ArrowDownUp } from 'react-bootstrap-icons';
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
            <ul className="nav nav-pills flex-row w-100 flex-md-column h-100 justify-content-between">
                <li>
                    <button className="btn btn-sidebar m-2 m-lg-3" onClick={() => setShowModal(true)}>
                        <Plus color="green" size={20} />
                    </button>
                </li>
                <li className="ms-auto me-0 mb-md-0 mt-md-auto">
                    <button className="btn btn-sidebar m-2 m-lg-3" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun color="gold" size={16} /> : <Moon color="silver" size={16} />}
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar m-2 m-lg-3" onClick={handleLogoutClick}>
                        <GearFill color="green" size={20} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar m-2 m-lg-3">
                        <GridFill color="blue" size={20} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar m-2 m-lg-3">
                        <CreditCardFill color="purple" size={20} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar m-2 m-lg-3">
                        <ArrowDownUp color="green" size={20} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar m-2 m-lg-3">
                        <GearFill color="gray" size={20} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar m-2 m-lg-3" onClick={abrirPerfil}>
                        <GearFill color="green" size={20} />
                    </button>
                </li>
            </ul>           
        </div>
    );
};

export default SideBar;
