
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
      isAuction: false,
      startingPrice: undefined,
      reservePrice: undefined,
      priceDecrement: undefined,
      priceDecrementInterval: "day",
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
      auctionDuration: "30days",
      noReserve: false,
      monthlyExpenses: [],
    },
  });

  // Watch reserve price and update noReserve field accordingly
  const reservePrice = form.watch("reservePrice");
  useEffect(() => {
    if (reservePrice === 0) {
      form.setValue("noReserve", true);
    } else if (reservePrice !== undefined) {
      form.setValue("noReserve", false);
    }
  }, [reservePrice, form]);

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
