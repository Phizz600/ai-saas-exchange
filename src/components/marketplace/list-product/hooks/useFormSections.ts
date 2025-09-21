
import { useState } from "react";
import { BasicInfoSection } from "../form-sections/BasicInfoSection";
import { FinancialSection } from "../form-sections/FinancialSection";
import { TechnicalSection } from "../form-sections/TechnicalSection";
import { TrafficSection } from "../form-sections/TrafficSection";
import { PricingSection } from "../form-sections/PricingSection";
import { SpecialNotesSection } from "../form-sections/SpecialNotesSection";

export const useFormSections = () => {
  const sections = [
    { id: 0, title: "Basics", component: BasicInfoSection },
    { id: 1, title: "Financials", component: FinancialSection },
    { id: 2, title: "Technical", component: TechnicalSection },
    { id: 3, title: "Traffic", component: TrafficSection },
    { id: 4, title: "Special Notes", component: SpecialNotesSection },
    { id: 5, title: "Pricing", component: PricingSection },
  ];

  const [currentSection, setCurrentSection] = useState(0);

  const handleSectionClick = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
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
    sections,
    currentSection,
    handleSectionClick,
    nextSection,
    previousSection,
  };
};
