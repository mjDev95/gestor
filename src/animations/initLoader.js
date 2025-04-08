import { gsap } from "gsap";

export const initLoader = () => {
  const tl = gsap.timeline();

  tl.set("html", { overflow: "hidden", cursor: "wait" });
  tl.set(".loading-screen", { top: "0" });

  tl.set(".loading-words", { opacity: 0, y: -50 });

  if (window.innerWidth > 540) {
    tl.set(".loading-screen .transition.bottom", { height: "100vh" });  
  } else {
    tl.set(".loading-screen .transition.bottom", { height: "100vh" }); 
  }

  tl.set("html", { cursor: "wait" });

  tl.to(".loading-words", {
    duration: 0.8,
    opacity: 1,
    y: 0,
    ease: "Power4.easeOut",
    delay: 0.5,
  });

	tl.to(".loading-screen", {
		duration: .7,
		top: "-100%",
		ease: "Power4.easeInOut",
    delay: .2
  });
  
  tl.to(
    ".loading-screen .transition li",
    {
      duration: 0.4,
      scaleY: 0,
      transformOrigin: "top left",
      stagger: 0.1,
    },
    "=-0.9"
  );

  tl.to(
    ".loading-words",
    {
      duration: 0.3,
      opacity: 0,
      ease: "linear",
    },
    "=-0.8"
  );

  // Limpieza final
  tl.set(".loading-screen", 
    { 
      top: "auto",
      bottom: "-100%" 
    }
  );
  tl.set(".loading-screen .transition.bottom", 
    { 
      clearProps: "all",
    }
  ); 
  tl.set(".loading-words", 
    { 
      clearProps: "all",
    }
  );
  tl.set(".loading-screen .transition.bottom li", 
    { 
      scaleY: 0,
      clearProps: "all",
    }
  ); 

  tl.set("html", { overflow: "auto", cursor: "auto" });
};