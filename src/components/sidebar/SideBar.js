import React, { useContext } from 'react';
import { Sun, Moon, Plus, GearFill, GridFill, CreditCardFill, ArrowDownUp } from 'react-bootstrap-icons';
import { ThemeContext } from '../../theme/ThemeProvider'; 
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { usePerfil } from '../../context/PerfilContext'; 
import { useDashboard } from '../../context/dashboardContext';
import { useGlobalState } from "../../context/GlobalState";
import { useModal } from "../../context/ModalContext";

const SideBar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext); 
    const { handleLogout } = useAuth();
    const navigate = useNavigate();
    const { abrirPerfil } = usePerfil();
    const { setActiveSection } = useDashboard();
    const { openModal } = useModal();
    const { handleSaveExpense, user } = useGlobalState();


    const handleLogoutClick = async () => {
        await handleLogout();  
        navigate('/login'); 
    };

    return (
        <div className="col-sidebar d-flex flex-md-column justify-content-between vh-100v align-items-center order-1 order-md-0">
            <ul className="nav nav-pills flex-row w-100 flex-md-column h-100 justify-content-between">
                <li>
                    <button className="btn btn-sidebar m-2 m-lg-3" onClick={() => openModal("transaccion", { handleSaveExpense, user })}>
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
                    <button className="btn btn-sidebar m-2 m-lg-3" onClick={() => setActiveSection("inicio")}>
                        <GridFill color="blue" size={20} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar m-2 m-lg-3" onClick={() => setActiveSection("mantenimiento")}>
                        <CreditCardFill color="purple" size={20} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar m-2 m-lg-3" onClick={() => setActiveSection("mantenimiento")}>
                        <ArrowDownUp color="green" size={20} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar m-2 m-lg-3" /*onClick={() => setActiveSection("configuracion")}*/ onClick={abrirPerfil}>
                        <GearFill color="gray" size={20} />
                    </button>
                </li>

            </ul>           
        </div>
    );
};

export default SideBar;
