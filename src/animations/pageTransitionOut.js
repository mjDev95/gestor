import { gsap } from "gsap";

export const pageTransitionOut = () => {
  const tl = gsap.timeline();

  tl.set("html", { overflow: "hidden", cursor: "wait" });


  if (window.innerWidth > 540) {
    tl.set(".loading-screen .transition.top", { height: "100vh" });  
  } else {
    tl.set(".loading-screen .transition.top", { height: "100vh" }); 
  }

  tl.to(
    ".loading-screen .transition li",
    {
      duration: 0.4,
      scaleY: 0,
      transformOrigin: "bottom left",
      stagger: 0.1,
    },
    "=-0.9"
  );

  // Limpieza final
  tl.set(".loading-screen", { top: "calc(-100%)" });
  tl.set(".loading-screen .transition li", { scaleY: 0 }); 

  tl.set("html", { overflow: "auto", cursor: "auto" });
};