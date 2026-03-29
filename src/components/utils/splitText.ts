import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (window.innerWidth < 900) return;

  const TriggerStart = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";
  const ToggleAction = "play pause resume reverse";

  document.querySelectorAll<HTMLElement>(".para").forEach((para) => {
    para.classList.add("visible");
    gsap.fromTo(
      para,
      { autoAlpha: 0, y: 80 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: para.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 1,
        ease: "power3.out",
        y: 0,
      }
    );
  });

  document.querySelectorAll<HTMLElement>(".title").forEach((title) => {
    gsap.fromTo(
      title,
      { autoAlpha: 0, y: 80, rotate: 5 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
      }
    );
  });

  ScrollTrigger.addEventListener("refresh", () => setSplitText());
}
