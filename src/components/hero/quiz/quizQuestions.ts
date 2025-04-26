import { QuizQuestion } from "./types";

export const quizQuestions: QuizQuestion[] = [{
  id: 1,
  question: "What AI category does your SaaS business primarily operate in?",
  options: [{
    value: "nlp",
    label: "Natural Language Processing / Generative AI",
    icon: "💬"
  }, {
    value: "cv",
    label: "Computer Vision / Image Recognition",
    icon: "👁️"
  }, {
    value: "ml",
    label: "Predictive Analytics / Machine Learning",
    icon: "📊"
  }, {
    value: "automation",
    label: "AI Automation / Workflow Tools",
    icon: "🤖"
  }, {
    value: "other",
    label: "Other AI Specialization",
    icon: "🔍"
  }]
}, {
  id: 2,
  question: "What is your average monthly recurring revenue (MRR)?",
  options: [{
    value: "5000",
    label: "$0 - $10,000"
  }, {
    value: "30000",
    label: "$10,000 - $50,000"
  }, {
    value: "75000",
    label: "$50,000 - $100,000"
  }, {
    value: "300000",
    label: "$100,000 - $500,000"
  }, {
    value: "750000",
    label: "$500,000+"
  }]
}, {
  id: 3,
  question: "How many active users does your platform have monthly?",
  options: [{
    value: "50",
    label: "Under 100"
  }, {
    value: "500",
    label: "100 - 1,000"
  }, {
    value: "5000",
    label: "1,000 - 10,000"
  }, {
    value: "50000",
    label: "10,000 - 100,000"
  }, {
    value: "500000",
    label: "100,000+"
  }]
}, {
  id: 4,
  question: "What is your year-over-year revenue growth rate?",
  options: [{
    value: "10",
    label: "0% - 20%"
  }, {
    value: "35",
    label: "20% - 50%"
  }, {
    value: "75",
    label: "50% - 100%"
  }, {
    value: "150",
    label: "100%+"
  }]
}, {
  id: 5,
  question: "How would you describe the market trend for your AI solution?",
  options: [{
    value: "emerging",
    label: "Emerging / High Growth Market"
  }, {
    value: "growing",
    label: "Growing / Positive Trend"
  }, {
    value: "stable",
    label: "Established / Stable Market"
  }, {
    value: "declining",
    label: "Declining / Challenged Market"
  }]
}];
