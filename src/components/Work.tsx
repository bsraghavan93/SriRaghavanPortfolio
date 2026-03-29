import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Work = () => {
  useGSAP(() => {
  let translateX: number = 0;

  function setTranslateX() {
    const box = document.getElementsByClassName("work-box");
    const rectLeft = document
      .querySelector(".work-container")!
      .getBoundingClientRect().left;
    const rect = box[0].getBoundingClientRect();
    const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
    let padding: number =
      parseInt(window.getComputedStyle(box[0]).padding) / 2;
    translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
  }

  setTranslateX();

  let timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".work-section",
      start: "top top",
      end: `+=${translateX}`, // Use actual scroll width
      scrub: true,
      pin: true,
      id: "work",
    },
  });

  timeline.to(".work-flex", {
    x: -translateX,
    ease: "none",
  });

  // Clean up (optional, good practice)
  return () => {
    timeline.kill();
    ScrollTrigger.getById("work")?.kill();
  };
}, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {[
            {
              title: "United Airlines — Loyalty & Accrual",
              category: "Lead Full Stack .NET Developer",
              tools: "C# .NET 6, React 18, Redux, MongoDB, Docker, Kubernetes, Azure DevOps",
            },
            {
              title: "New Jersey Treasury",
              category: "Lead Full Stack .NET Developer",
              tools: ".NET Core, Angular, Blazor, Azure Functions, SQL Server 2019, Power BI",
            },
            {
              title: "United Airlines — Inflight Records",
              category: "Lead Full Stack .NET Developer",
              tools: "C# .NET 6, React, Angular 14, Redux, Redis, Azure, Kubernetes",
            },
            {
              title: "Rocket Mortgage",
              category: "Full Stack .NET Developer",
              tools: "C# .NET Core, Next.js, Angular 7, Blazor, Azure Synapse, Docker",
            },
            {
              title: "LinkedIn",
              category: "Full Stack .NET Developer",
              tools: "React JS, Angular, .NET Core, Node.js, Azure DevOps, Kotlin",
            },
            {
              title: "Wells Fargo",
              category: ".NET Developer",
              tools: "C# .NET Core, React JS, Azure, Kafka, Microservices, SQL Server",
            },
          ].map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>
                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
              </div>
              <WorkImage image="/images/placeholder.webp" alt={project.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
