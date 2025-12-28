// Modal global reutilizable para crear y editar transacciones (gastos, ingresos, ahorros)
import { useEffect, useRef, useState } from "react";
import { useModal } from "../../context/ModalContext";
import ExpenseForm from "../transactions/ExpenseForm";
import IncomeForm from "../transactions/IncomeForm";
import TarjetaForm from "../tarjetas/TarjetaForm";
import Tabs from "../tabs/Tabs";
import { Check, ExclamationCircle, XLg } from "react-bootstrap-icons";
import { showBackdrop, showModal, hideModal, hideBackdrop, morphToCircle, morphToRect, bounceCheck, shakeButton, showErrorMsg, } from "../../utils/gsapAnimations";
import { useSwipeTabs } from "../../hooks/useSwipeTabs";

// GlobalModal
// Este componente escucha el estado global del modal (ModalContext)
// y renderiza dinámicamente el contenido según `modal.tipo`
const GlobalModal = () => {
  // Referencias a elementos del DOM y formularios
  // Se usan para animaciones, submit manual y control del modal
  const { modal, closeModal } = useModal();
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const btnGuardarRef = useRef(null);
  const errorMsgRef = useRef(null);

  // Estados locales del modal:
  // - isVisible: controla renderizado con animaciones
  // - activeTab: tab actualmente activa
  // - errorForm: mensaje de error del formulario
  // - guardado / guardando / morphing: control visual del botón Guardar
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("gasto");
  const [errorForm, setErrorForm] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [morphing, setMorphing] = useState(false);

  // Cuando el modal se abre:
  // - Se muestra el backdrop
  // - Se ejecuta la animación de entrada del modal
  useEffect(() => {
    if (modal.open) {
      setIsVisible(true);
      showBackdrop(backdropRef);
      showModal(modalRef);
    }
  }, [modal.open]);

  // Cierra el modal con animaciones
  // Limpia estados internos y resetea el contexto del modal
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

  // Maneja el flujo completo del botón Guardar:
  // - Ejecuta animaciones
  // - Llama al submit del formulario activo
  // - Muestra éxito o error según el resultado
  let handleSave = async () => {
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

  // Cancela la acción actual:
  // - Resetea el formulario si existe
  // - Cierra el modal
  const handleCancel = () => {
    if (formRef.current && formRef.current.resetForm) {
      formRef.current.resetForm();
    }
    handleClose();
  };

  // Variables dinámicas que se definen según el tipo de modal:
  // - modalTitle: título del modal
  // - tabs: configuración de tabs
  // - activeTabData: contenido del tab activo
  let modalTitle = "Modal";
  let tabs = null;
  let activeTabData = null;

  // Decide qué mostrar dentro del modal según el tipo:
  // - "transaccion": agregar nueva transacción
  // - "editar-transaccion": editar una transacción existente
  switch (modal.tipo) {
    case "transaccion":
      // Modo CREAR:
      // Tabs libres (Gasto / Ingreso / Ahorro)
      // El usuario puede elegir el tipo de transacción
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
    case "editar-transaccion": {
      // Modo EDITAR:
      // - Detecta el tipo real de la transacción
      // - Activa automáticamente la tab correcta
      // - Deshabilita las demás para evitar cambiar el tipo
      const { transaction } = modal.props;

      const tipoTab =
        transaction?.tipo === "ingresos"
          ? "ingreso"
          : transaction?.tipo === "ahorro"
          ? "ahorro"
          : "gasto";

      modalTitle = "Editar transacción";

      tabs = [
        {
          key: "gasto",
          label: "Gasto",
          disabled: tipoTab !== "gasto",
          content: (
            <ExpenseForm
              ref={formRef}
              initialData={transaction}
              modo="editar"
              handleSaveExpense={modal.props.handleSaveExpense}
            />
          )
        },
        {
          key: "ingreso",
          label: "Ingreso",
          disabled: tipoTab !== "ingreso",
          content: (
            <IncomeForm
              ref={formRef}
              initialData={transaction}
              modo="editar"
              handleSaveExpense={modal.props.handleSaveExpense}
            />
          )
        },
        {
          key: "ahorro",
          label: "Ahorro",
          disabled: true,
          content: <div>Próximamente...</div>
        }
      ];

      setTimeout(() => setActiveTab(tipoTab), 0);
      activeTabData = tabs.find(tab => tab.key === tipoTab);
      break;
    }
    case "eliminar-transaccion": {
      const { transaction, tipo, handleDeleteTransaction } = modal.props;

      modalTitle = "Eliminar transacción";

      tabs = null;

      activeTabData = {
        content: (
          <div className="text-center py-4">
            <p className="mb-3">
              ¿Estás seguro de que deseas eliminar esta transacción?
            </p>
            <strong>{transaction.nombre}</strong>
            
          </div>
        )
      };

      // Sobrescribimos el comportamiento del botón Guardar
      // para que ejecute el eliminado
      handleSave = async () => {
        try {
          setGuardando(true);
          await handleDeleteTransaction(transaction.id, tipo);
          setGuardado(true);
          setTimeout(() => handleClose(), 600);
        } catch (error) {
          setErrorForm("No se pudo eliminar la transacción.");
        }
      };

      break;
    }
    case "editar-tarjeta": {
      const { tarjeta, handleSaveTarjeta } = modal.props;

      modalTitle = "Editar Tarjeta";
      tabs = null;

      activeTabData = {
        content: (
          <TarjetaForm
            ref={formRef}
            initialData={tarjeta}
            modo="editar"
            handleSaveTarjeta={handleSaveTarjeta}
          />
        )
      };
      break;
    }
    case "eliminar-tarjeta": {
      const { tarjeta, handleDeleteTarjeta } = modal.props;

      modalTitle = "Eliminar Tarjeta";
      tabs = null;

      activeTabData = {
        content: (
          <div className="text-center py-4">
            <p className="mb-3">
              ¿Estás seguro de que deseas eliminar esta tarjeta?
            </p>
            <div className="mb-3">
              <strong className="d-block">{tarjeta.banco}</strong>
              <small className="text-muted">**** **** **** {tarjeta.terminacion}</small>
            </div>
            <div className="alert alert-warning mt-3">
              <small>Esta acción no se puede deshacer.</small>
            </div>
          </div>
        )
      };

      // Sobrescribimos el comportamiento del botón Guardar
      // para que ejecute el eliminado
      handleSave = async () => {
        try {
          setMorphing(true);
          morphToCircle(btnGuardarRef);
          await new Promise(res => setTimeout(res, 400));
          
          setGuardando(true);
          const resultado = await handleDeleteTarjeta(tarjeta.id);
          setGuardando(false);

          if (resultado?.success) {
            setGuardado(true);
            bounceCheck(btnGuardarRef);
            setTimeout(() => handleClose(), 600);
          } else {
            setMorphing(false);
            morphToRect(btnGuardarRef);
            setErrorForm(resultado?.message || "No se pudo eliminar la tarjeta.");
            setTimeout(() => {
              if (errorMsgRef.current) {
                showErrorMsg(errorMsgRef);
              }
            }, 0);
            shakeButton(btnGuardarRef);
            setTimeout(() => {
              setErrorForm("");
            }, 4000);
          }
        } catch (error) {
          setGuardando(false);
          setMorphing(false);
          morphToRect(btnGuardarRef);
          setErrorForm(error.message || "Ocurrió un error al eliminar.");
          setTimeout(() => {
            if (errorMsgRef.current) {
              showErrorMsg(errorMsgRef);
            }
          }, 0);
          shakeButton(btnGuardarRef);
          setTimeout(() => {
            setErrorForm("");
          }, 4000);
        }
      };

      break;
    }
    case "tarjeta-con-transacciones": {
      const { tarjeta, verificacion } = modal.props;

      modalTitle = "No se puede eliminar";
      tabs = null;

      activeTabData = {
        content: (
          <div className="text-center py-4">
            <div className="mb-4">
              <i className="bi bi-exclamation-circle text-warning" style={{ fontSize: '3rem' }}></i>
            </div>
            <p className="mb-3">
              No se puede eliminar la tarjeta:
            </p>
            <div className="mb-3">
              <strong className="d-block">{tarjeta.banco}</strong>
              <small className="text-muted">**** **** **** {tarjeta.terminacion}</small>
            </div>
            <div className="alert alert-warning mt-3">
              <i className="bi bi-info-circle me-2"></i>
              {verificacion.mensaje}
            </div>
          </div>
        )
      };

      // Sobrescribimos handleSave para cerrar directamente sin animaciones
      handleSave = () => {
        handleCancel();
      };

      break;
    }
    default:
      break;
  }
  // Hook para permitir swipe entre tabs (mobile / desktop)
  // Respeta tabs deshabilitadas
  const { handleStart, handleEnd } = useSwipeTabs({ tabs, activeTab, setActiveTab });

  // Evita renderizar el modal si está completamente cerrado
  if (!modal.open && !isVisible) return null;

  // Renderizado del modal:
  // Incluye backdrop, header con tabs, body dinámico y footer con botón Guardar
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
            {/* Botón Cancelar solo si no está morphing, guardando, guardado NI error Y no es modal informativo */}
            {!(morphing || guardando || guardado || errorForm || modal.tipo === "tarjeta-con-transacciones") && (
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            )}

            {/* Botón Guardar con morphing, error y animaciones */}
            <button
              type="button"
              ref={btnGuardarRef}
              className={`btn m-0 py-0 morph-btn ${ 
                guardado ? "btn-success" : 
                errorForm || modal.tipo === "eliminar-transaccion" || modal.tipo === "eliminar-tarjeta" ? "btn-danger" : 
                modal.tipo === "tarjeta-con-transacciones" ? "btn-warning" :
                "btn-primary" 
              }`}
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
                modal.tipo === "eliminar-transaccion" || modal.tipo === "eliminar-tarjeta" ? "Eliminar" : 
                modal.tipo === "tarjeta-con-transacciones" ? "Entendido" :
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