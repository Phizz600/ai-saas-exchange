
import { useState } from "react";

export const useFormNavigation = (totalSections: number) => {
  const [currentSection, setCurrentSection] = useState(0);

  const handleSectionClick = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextSection = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    currentSection,
    handleSectionClick,
    nextSection,
    previousSection
  };
};
