import React  from 'react';
import { Plus, GearFill, GridFill, CreditCardFill, ArrowDownUp } from 'react-bootstrap-icons';
import { usePerfil } from '../../context/PerfilContext'; 
import { useDashboard } from '../../context/dashboardContext';
import { useGlobalState } from "../../context/GlobalState";
import { useModal } from "../../context/ModalContext";

const SideBar = () => {
    const { abrirPerfil } = usePerfil();
    const { setActiveSection } = useDashboard();
    const { openModal } = useModal();
    const { handleSaveExpense, user } = useGlobalState();


    return (
        <div className="col-sidebar d-flex flex-md-column justify-content-between vh-100v align-items-center order-1 order-md-0">
            <ul className="nav nav-pills flex-row w-100 flex-md-column h-100 justify-content-between">
                <li>
                    <button className="btn btn-sidebar mx-auto my-2 my-lg-3 mx-lg-3" onClick={() => openModal("transaccion", { handleSaveExpense, user })}>
                        <Plus color="green" size={20} />
                    </button>
                </li>
                
                <li className="mt-md-auto">
                    <button className="btn btn-sidebar mx-auto my-2 my-lg-3 mx-lg-3" onClick={() => setActiveSection("inicio")}>
                        <GridFill color="blue" size={20} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar mx-auto my-2 my-lg-3 mx-lg-3" onClick={() => setActiveSection("tarjetas")}>
                        <CreditCardFill color="purple" size={20} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-sidebar mx-auto my-2 my-lg-3 mx-lg-3" onClick={() => setActiveSection("transacciones")}>
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
