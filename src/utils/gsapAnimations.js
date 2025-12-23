import gsap from "gsap";

// Timeline base: oculta sidebar (translateY) y FAB (scale)
export const createMobileSidebarTimeline = (sidebarEl, addBtnEl) => {
  if (!sidebarEl || !addBtnEl) return null;

  const tl = gsap.timeline({ paused: true });

  tl.to(
    sidebarEl,
    {
      y: "100%",
      duration: 0.35,
      ease: "power3.inOut",
    },
    0
  ).to(
    addBtnEl,
    {
      scale: 0,
      transformOrigin: "50% 50%",
      duration: 0.28,
      ease: "power2.inOut",
    },
    0
  );

  return tl;
};

// Mostrar sidebar móvil
export const showMobileSidebar = (tl) => {
  if (!tl) return;
  tl.reverse();
  document.body.classList.remove("sidebar-hidden");
};

// Ocultar sidebar móvil
export const hideMobileSidebar = (tl) => {
  if (!tl) return;
  tl.play();
  document.body.classList.add("sidebar-hidden");
};

// Micro animación del FAB al reaparecer (solo scale)
export const microScaleButtonIn = (btnEl) => {
  if (!btnEl) return;

  gsap.fromTo(
    btnEl,
    {
      scale: 0,
      transformOrigin: "50% 50%",
    },
    {
      scale: 1,
      duration: 0.32,
      ease: "power3.out",
    }
  );
};

// Animación del indicador del sidebar móvil
export const animateSidebarIndicator = (indicatorEl, activeButtonEl) => {
  if (!indicatorEl || !activeButtonEl) return;

  // Obtener posición del botón activo y su contenedor
  const buttonRect = activeButtonEl.getBoundingClientRect();
  const containerRect = activeButtonEl.parentElement.getBoundingClientRect();

  // Animar el indicador con GSAP
  gsap.to(indicatorEl, {
    x: buttonRect.left - containerRect.left, // Desplazamiento horizontal
    width: buttonRect.width,                 // Ancho igual al del botón
    duration: 0.4,
    ease: "power3.out",
  });
};

// Animación del indicador de tabs
export const animateTabIndicator = (indicatorEl, activeButtonEl) => {
  if (!indicatorEl || !activeButtonEl) return;

  // Obtener posición del botón activo y su contenedor
  const buttonRect = activeButtonEl.getBoundingClientRect();
  const containerRect = activeButtonEl.parentElement.getBoundingClientRect();

  // Animar el indicador con GSAP
  gsap.to(indicatorEl, {
    x: buttonRect.left - containerRect.left, // Desplazamiento horizontal
    width: buttonRect.width,                 // Ancho igual al del botón
    duration: 0.4,
    ease: "power3.out",
  });
};

// Animación de aparición del backdrop
export const showBackdrop = (backdropRef) =>
  gsap.fromTo(
    backdropRef.current,
    { opacity: 0, filter: "blur(0px)" },
    {
      opacity: 1,
      filter: "blur(13px)",
      duration: 0.4,
      ease: "power1.out",
    }
  );

// Animación de aparición del modal
export const showModal = (modalRef) => {
  const tl = gsap.timeline();
  tl.fromTo(
    modalRef.current,
    { y: -200, opacity: 0 },
    {
      y: 100,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      delay: 0.2,
    }
  ).to(modalRef.current, {
    y: 0,
    duration: 0.5,
    ease: "bounce.out",
  });
  return tl;
};

// Animación de cierre del modal
export const hideModal = (modalRef) =>
  gsap.to(modalRef.current, {
    y: -100,
    opacity: 0,
    duration: 0.3,
    ease: "power1.in",
  });

// Animación de cierre del backdrop
export const hideBackdrop = (backdropRef, onComplete) =>
  gsap.to(backdropRef.current, {
    opacity: 0,
    filter: "blur(0px)",
    duration: 0.3,
    ease: "power1.in",
    onComplete,
  });

// Morph a círculo del botón guardar
export const morphToCircle = (btnRef) =>
  gsap.to(btnRef.current, {
    width: 56,
    borderRadius: "50%",
    duration: 0.4,
    ease: "power2.inOut",
  });

// Morph a rectángulo del botón guardar
export const morphToRect = (btnRef) =>
  gsap.to(btnRef.current, {
    width: 120,
    borderRadius: "1.5rem",
    duration: 0.4,
    ease: "power2.inOut",
  });

// Bounce check animación
export const bounceCheck = (btnRef) =>
  gsap.fromTo(
    btnRef.current,
    { scale: 1 },
    { scale: 1.2, yoyo: true, repeat: 1, duration: 0.2, ease: "bounce.out" }
  );

// Shake animación para error
export const shakeButton = (btnRef) =>
  gsap.fromTo(
    btnRef.current,
    { x: 0 },
    { x: -15, repeat: 3, yoyo: true, duration: 0.1 }
  );

// Animación de mensaje de error
export const showErrorMsg = (errorMsgRef) =>
  gsap.fromTo(
    errorMsgRef.current,
    { opacity: 0, x: "500%" },
    { opacity: 1, x: "0%", duration: 0.7, ease: "power2.out" }
  );