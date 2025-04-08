import { gsap } from "gsap";

export const pageTransitionIn = () => {
  const tl = gsap.timeline();

  tl.set("html", { overflow: "hidden", cursor: "wait" });
  tl.set(".loading-screen", { top: "0" });
  tl.set(".loading-words", { opacity: 0, y: -50 });

  if (window.innerWidth > 540) {
    tl.set(".loading-screen .transition.top", { height: "0vh" }); 
  } else {
    tl.set(".loading-screen .transition.top", { height: "0vh" }); 
  }

  tl.to(
    ".loading-screen .transition li",
    {
      duration: 0.4,
      scaleY: 1,
      transformOrigin: "bottom center",
      stagger: 0.1, 
      ease: "Power4.easeInOut",
    },
    "=-0.5"
  );


  tl.to(
    ".loading-screen",
    {
      duration: 0.7,
      top: "0%", 
      ease: "Power4.easeInOut",
      delay: .2
    },
    "=-0.5"
  );

  // Limpieza final
  tl.set(".loading-screen .transition li", { scaleY: 0 }); 
  tl.set("html", { overflow: "auto", cursor: "auto" });
};