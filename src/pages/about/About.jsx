import { useEffect } from "react";
import Headers from "../../components/Headers";
import Footer from "../../components/Footer";
import HeroSection from "./components/HeroSection";
import AboutContent from "./components/AboutContent";
import MissionVision from "./components/MissionVision";
import StatsCounter from "./components/StatsCounter";
import ValuesGrid from "./components/ValuesGrid";
import CTASection from "./components/CTASection";
import "./About.css";

const About = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const metaName = "description";
    let descriptionTag = document.querySelector(`meta[name="${metaName}"]`);
    const previousDescription = descriptionTag?.getAttribute("content") || "";

    document.title = "About myHaat | Multi Vendor Marketplace";

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", metaName);
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute(
      "content",
      "Learn about myHaat multi-vendor ecommerce platform connecting sellers and buyers.",
    );

    return () => {
      document.title = previousTitle;

      if (descriptionTag) {
        if (previousDescription) {
          descriptionTag.setAttribute("content", previousDescription);
        } else if (descriptionTag.parentNode) {
          descriptionTag.parentNode.removeChild(descriptionTag);
        }
      }
    };
  }, []);

  return (
    <div className="about-page min-h-screen">
      <Headers />
      <main>
        <HeroSection />
        <AboutContent />
        <MissionVision />
        <StatsCounter />
        <ValuesGrid />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
