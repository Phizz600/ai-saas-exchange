
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ListProductFormData } from "../types";

export const useListProductForm = () => {
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  // Initialize form with default values
  const form = useForm<ListProductFormData>({
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      category: "",
      stage: "",
      industry: "",
      monthlyRevenue: undefined,
      monthlyTraffic: "",
      activeUsers: "",
      grossProfitMargin: undefined,
      image: null,
      techStack: "",
      techStackOther: "",
      teamSize: "",
      hasPatents: false,
      competitors: "",
      demoUrl: "",
      isVerified: false,
      specialNotes: "",
      accuracyAgreement: false,
      termsAgreement: false,
      deliverables: [],
      productLink: "",
      monthlyExpenses: [],
    },
  });


  // Function to clear all errors
  const clearErrors = () => {
    setSubmissionError(null);
    setFormErrors({});
  };

  return {
    form,
    isSubmitting,
    setIsSubmitting,
    redirecting,
    setRedirecting,
    submissionError,
    setSubmissionError,
    formErrors,
    setFormErrors,
    submissionSuccess,
    setSubmissionSuccess,
    submissionAttempted,
    setSubmissionAttempted,
    clearErrors
  };
};
