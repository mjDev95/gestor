import React  from 'react';
import { Plus, GearFill, GridFill, CreditCardFill, ArrowDownUp } from 'react-bootstrap-icons';
import { usePerfil } from '../../context/PerfilContext'; 
import { useDashboard } from '../../context/dashboardContext';
import { useGlobalState } from "../../context/GlobalState";
import { useModal } from "../../context/ModalContext";

const SideBar = ({ variant = "desktop" }) => {
    const { abrirPerfil } = usePerfil();
    const { activeSection, setActiveSection } = useDashboard();
    const { openModal } = useModal();
    const { handleSaveExpense, user } = useGlobalState();


    return (
        <div
          className={`col-sidebar ${
            variant === "desktop"
              ? "d-none d-md-flex flex-md-column justify-content-between align-items-center sidebar-desktop"
              : "d-flex d-md-none flex-row justify-content-around align-items-center fixed-bottom  sidebar-mobile w-100 py-2"
          }`}
        >
            <ul
              className={`nav nav-pills w-100 ${
                variant === "desktop"
                  ? "flex-row flex-md-column h-100 justify-content-between"
                  : "flex-row justify-content-around"
              }`}
            >
                <li>
                    <button className="btn btn-sidebar mx-auto my-2 my-lg-3 mx-lg-3" onClick={() => openModal("transaccion", { handleSaveExpense, user })}>
                        <Plus color="green" size={20} />
                    </button>
                </li>
            
                <li className="mt-md-auto">
                    <button className={`btn btn-sidebar mx-auto my-2 my-lg-3 mx-lg-3 ${activeSection === "inicio" ? "active" : ""}`} onClick={() => setActiveSection("inicio")}>
                        <GridFill color="blue" size={20} />
                    </button>
                </li>
                <li>
                    <button className={`btn btn-sidebar mx-auto my-2 my-lg-3 mx-lg-3 ${activeSection === "tarjetas" ? "active" : ""}`} onClick={() => setActiveSection("tarjetas")}>
                        <CreditCardFill color="purple" size={20} />
                    </button>
                </li>
                <li>
                    <button className={`btn btn-sidebar mx-auto my-2 my-lg-3 mx-lg-3 ${activeSection === "transacciones" ? "active" : ""}`} onClick={() => setActiveSection("transacciones")}>
                        <ArrowDownUp color="green" size={20} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar mx-auto my-2 my-lg-3 mx-lg-3" /*onClick={() => setActiveSection("configuracion")}*/ onClick={abrirPerfil}>
                        <GearFill color="gray" size={20} />
                    </button>
                </li>

            </ul>           
        </div>
    );
};

export default SideBar;
