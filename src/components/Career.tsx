import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack .NET Developer Intern</h4>
                <h5>Wells Fargo — Phoenix, AZ</h5>
              </div>
              <h3>2016</h3>
            </div>
            <p>
              Contributed to web application development using C#, ASP.NET MVC,
              and Entity Framework. Built dynamic UIs with React JS and assisted
              in developing RESTful APIs and database optimizations with T-SQL.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack .NET Developer</h4>
                <h5>LinkedIn — San Francisco, CA</h5>
              </div>
              <h3>2018</h3>
            </div>
            <p>
              Engineered payment gateways and web applications integrating
              legacy data with ReactJS, Angular, and .NET Core. Pioneered CI/CD
              automation with Azure DevOps and built microservices using Node.js
              and Kotlin with Spring Boot.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Lead Full Stack .NET Developer</h4>
                <h5>United Airlines — Chicago, IL</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Leading development of RESTful APIs for MileagePlus loyalty
              currencies using C# .NET 6, ASP.NET Core, and Entity Framework.
              Built microservices handling 10,000+ concurrent requests with
              Docker and Kubernetes, and reduced release time from 4 hours to 15
              minutes via Azure DevOps CI/CD pipelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
