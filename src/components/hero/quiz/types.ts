
export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    value: string;
    label: string;
    icon?: string;
  }[];
}

export interface FormData {
  name: string;
  email: string;
  company: string;
  sellingInterest: boolean;
}
