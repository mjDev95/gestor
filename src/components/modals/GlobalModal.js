import { useEffect, useRef, useState } from "react";
import { useModal } from "../../context/ModalContext";
import ExpenseForm from "../transactions/ExpenseForm";
import IncomeForm from "../transactions/IncomeForm";
import Tabs from "../tabs/Tabs";
import { Check, ExclamationCircle, XLg } from "react-bootstrap-icons";
import { showBackdrop, showModal, hideModal, hideBackdrop, morphToCircle, morphToRect, bounceCheck, shakeButton, showErrorMsg, } from "../../utils/gsapAnimations";
import { useSwipeTabs } from "../../hooks/useSwipeTabs";

const GlobalModal = () => {
  const { modal, closeModal } = useModal();
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const btnGuardarRef = useRef(null);
  const errorMsgRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("gasto");
  const [errorForm, setErrorForm] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [morphing, setMorphing] = useState(false);

  useEffect(() => {
    if (modal.open) {
      setIsVisible(true);
      showBackdrop(backdropRef);
      showModal(modalRef);
    }
  }, [modal.open]);

  const handleClose = () => {
    hideModal(modalRef);
    hideBackdrop(backdropRef, () => {
      setIsVisible(false);
      closeModal();
      setErrorForm("");
      setGuardado(false);
      setGuardando(false);
      setMorphing(false);
    });
  };

  const handleSave = async () => {
    if (formRef.current && formRef.current.submitForm) {
      setErrorForm("");
      setMorphing(true);
      setGuardando(false);
      setGuardado(false);

      morphToCircle(btnGuardarRef);

      await new Promise(res => setTimeout(res, 400)); // Espera morph
      setGuardando(true);

      const exito = await formRef.current.submitForm();

      setGuardando(false);

      if (exito) {
        setGuardado(true);
        bounceCheck(btnGuardarRef);
        setTimeout(() => {
          handleCancel();
        }, 900);
      } else {
        setMorphing(false);
        morphToRect(btnGuardarRef);
        setErrorForm("Por favor, completa todos los campos correctamente.");
        setTimeout(() => {
          if (errorMsgRef.current) {
            showErrorMsg(errorMsgRef);
          }
        }, 0);
        shakeButton(btnGuardarRef);
        setTimeout(() => {
          morphToRect(btnGuardarRef);
          setErrorForm("");
        }, 3000);
      }
    }
  };

  const handleCancel = () => {
    if (formRef.current && formRef.current.resetForm) {
      formRef.current.resetForm();
    }
    handleClose();
  };

  let modalTitle = "Modal";
  let tabs = null;
  let activeTabData = null;

  switch (modal.tipo) {
    case "transaccion":
      modalTitle = "Agregar transacción";
      tabs = [
        {
          key: "gasto",
          label: "Gasto",
          content: <ExpenseForm ref={formRef} {...modal.props}/>
        },
        {
          key: "ingreso",
          label: "Ingreso",
          content: <IncomeForm ref={formRef} {...modal.props}/>
        },
        {
          key: "ahorro",
          label: "Ahorro",
          content: <div>Próximamente...</div>
        }
      ];
      activeTabData = tabs.find(tab => tab.key === activeTab);
      break;
    default:
      break;
  }
  const { handleStart, handleEnd } = useSwipeTabs({ tabs, activeTab, setActiveTab });

  if (!modal.open && !isVisible) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-overlay position-absolute top-0 start-0 w-100 h-100" ref={backdropRef} onClick={handleClose} ></div>

      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" ref={modalRef} onClick={e => e.stopPropagation()}>

        <div className="modal-content border-0 rounded-5 shadow-lg">
          <div className="modal-header d-block border-0 pb-0 px-4 pt-4">
            <div className="d-flex align-items-center justify-content-between w-100 mb-3">
              <h5 className="modal-title">{modalTitle}</h5>
              <button type="button" className="close-btn btn btn-link" aria-label="Close" onClick={handleCancel}>
                <XLg size={24} />
              </button>
            </div>
            
            {tabs && (
              <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
          </div>
          <div className="modal-body px-4">
            <div className="tabs-content dragrable" onTouchStart={handleStart} onTouchEnd={handleEnd} onMouseDown={handleStart} onMouseUp={handleEnd}>
              {activeTabData?.content}
            </div>
          </div>

          <div className="modal-footer p-4 pt-2 border-top-0 position-relative">
            {/* Botón Cancelar solo si no está morphing, guardando, guardado NI error */}
            {!(morphing || guardando || guardado || errorForm) && (
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            )}

            {/* Botón Guardar con morphing, error y animaciones */}
            <button
              type="button"
              ref={btnGuardarRef}
              className={`btn m-0 py-0 morph-btn ${guardado ? "btn-success" : errorForm ? "btn-danger" : "btn-primary"}`}
              onClick={handleSave}
              disabled={guardando || guardado || morphing || !!errorForm}
              style={{
                width: errorForm ? "100%" : (morphing || guardado ? 220 : 120),
                height: 56,
                borderRadius: morphing || guardado ? "50%" : "1.5rem",
                transition: "all 0.4s cubic-bezier(.68,-0.55,.27,1.55)",
                flex: errorForm ? 1 : undefined 
              }}
            >
              {guardado ? (
                <Check size={28} className="bounce-in" />
              ) : morphing ? (
                <span className="spinner-border spinner-border-sm" />
              ) : errorForm ? (
                <div ref={errorMsgRef} className={`align-items-center justify-content-center text-start ${errorForm ? "d-flex w-100" : "d-none w-0"}`} style={{ opacity: 0, transform: "translateX(500%)" }} >
                  <ExclamationCircle size={20} className="me-2" />
                  <span className="flex-grow-1">{errorForm}</span>
                </div>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalModal;