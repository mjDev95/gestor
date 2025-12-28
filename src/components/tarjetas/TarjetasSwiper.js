import React, { useState } from "react";
import { motion } from "framer-motion";
import { useGlobalState } from '../../context/GlobalState';
import { useModal } from '../../context/ModalContext';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from 'swiper/modules';
import "swiper/css";
import 'swiper/css/scrollbar';
import "./TarjetasSwiper.scss";



const TarjetasSwiper = ({ onEdit, onDelete, onSelectCard }) => {
  const { tarjetas, handleSaveTarjeta, deleteTarjeta, verificarTarjetaTieneTransacciones } = useGlobalState();
  const { openModal } = useModal();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [verificando, setVerificando] = useState(false);

  const handleEdit = (e, tarjeta) => {
    e.stopPropagation();
    setOpenDropdown(null);
    openModal('editar-tarjeta', {
      tarjeta,
      handleSaveTarjeta
    });
  };

  const handleDelete = async (e, tarjeta) => {
    e.stopPropagation();
    setOpenDropdown(null);
    
    // Mostrar estado de carga mientras verifica
    setVerificando(true);
    
    try {
      // Verificar si tiene transacciones antes de mostrar el modal
      const verificacion = await verificarTarjetaTieneTransacciones(tarjeta.id);
      
      // Solo abrir el modal después de tener la respuesta
      if (verificacion.tieneTransacciones) {
        // Mostrar modal informativo (no se puede eliminar)
        openModal('tarjeta-con-transacciones', {
          tarjeta,
          verificacion
        });
      } else {
        // Mostrar modal de confirmación de eliminación
        openModal('eliminar-tarjeta', {
          tarjeta,
          handleDeleteTarjeta: deleteTarjeta
        });
      }
    } finally {
      setVerificando(false);
    }
  };

  const toggleDropdown = (e, tarjetaId) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === tarjetaId ? null : tarjetaId);
  };
  return (
    <div className="tarjetas-swiper-container">
      <Swiper
        modules={[Scrollbar]}
        scrollbar={{
            hide: false,
            draggable: true,
            snapOnRelease: true,
        }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          576: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 2.5},
          1200:{ slidesPerView: 3 },
          1400:{ slidesPerView: 4 },
        }}
        className="tarjetas-swiper"
      >
        {tarjetas && tarjetas.length > 0 ? (
          tarjetas.map((t, idx) => (
            <SwiperSlide key={t.id || idx} className="pb-4">
              <motion.div 
                layoutId={`tarjeta-${t.id}`}
                className="card shadow-sm border-0 tarjeta-virtual position-relative h-100 cursor-pointer"
                style={{ cursor: 'pointer' }}
                layout
                onClick={() => onSelectCard && onSelectCard(t)}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Menú de opciones */}
                <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                  <div className="dropdown">
                    <button
                      className="btn btn-link p-0 text-muted"
                      type="button"
                      onClick={(e) => toggleDropdown(e, t.id)}
                      style={{ 
                        textDecoration: 'none',
                        lineHeight: 1
                      }}
                    >
                      <ThreeDotsVertical size={20} />
                    </button>
                    {openDropdown === t.id && (
                      <ul 
                        className="dropdown-menu show position-absolute end-0 overflow-hidden " 
                        style={{ minWidth: '150px' }}
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={(e) => handleEdit(e, t)}
                          >
                            <i className="bi bi-pencil me-2"></i>
                            Editar
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={(e) => handleDelete(e, t)}
                          >
                            <i className="bi bi-trash me-2"></i>
                            Eliminar
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <img src={t.logo} alt={t.banco} width={36} height={36} className="me-2 d-none" />
                    <span className="fw-bold">{t.banco}</span>
                    {t.principal && <span className="badge bg-success ms-auto">Principal</span>}
                  </div>
                  <div className="d-flex justify-content-between text-muted small">
                    <span>Vence: {t.vence}</span>
                    <span>{t.tipo}</span>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                  <div className="mb-2">
                    <span className="fs-4 fw-semibold">**** **** **** {t.terminacion}</span>
                  </div>
                  <div className="logos-acreditacion d-flex align-items-center">
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))
        ) : (
          <div className="text-center w-100 py-5">No tienes tarjetas guardadas.</div>
        )}
      </Swiper>
    </div>
  );
};

export default TarjetasSwiper;