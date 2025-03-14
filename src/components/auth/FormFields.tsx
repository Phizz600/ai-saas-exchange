
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Asterisk, Mail, Lock, User } from "lucide-react";

interface NameFieldProps {
  firstName: string;
  setFirstName: (value: string) => void;
  isLoading: boolean;
  isGoogleLoading: boolean;
}

export const NameField = ({ firstName, setFirstName, isLoading, isGoogleLoading }: NameFieldProps) => {
  return (
    <div className="text-left">
      <div className="flex items-center gap-1 mb-2">
        <Label htmlFor="firstName" className="text-left text-white text-base">First Name</Label>
        <Asterisk className="h-3 w-3 text-red-500" />
      </div>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="pl-10 bg-white/20 text-white backdrop-blur-md border-white/30 focus:border-[#D946EE] placeholder:text-white/50"
          placeholder="Enter your first name"
          disabled={isLoading || isGoogleLoading}
        />
      </div>
    </div>
  );
};

interface EmailFieldProps {
  email: string;
  setEmail: (value: string) => void;
  isLoading: boolean;
  isGoogleLoading: boolean;
}

export const EmailField = ({ email, setEmail, isLoading, isGoogleLoading }: EmailFieldProps) => {
  return (
    <div className="text-left">
      <div className="flex items-center gap-1 mb-2">
        <Label htmlFor="email" className="text-left text-white text-base">Email</Label>
        <Asterisk className="h-3 w-3 text-red-500" />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="pl-10 bg-white/20 text-white backdrop-blur-md border-white/30 focus:border-[#D946EE] placeholder:text-white/50"
          placeholder="Enter your email"
          disabled={isLoading || isGoogleLoading}
        />
      </div>
    </div>
  );
};

interface PasswordFieldProps {
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  isGoogleLoading: boolean;
}

export const PasswordField = ({ password, setPassword, isLoading, isGoogleLoading }: PasswordFieldProps) => {
  return (
    <div className="text-left">
      <div className="flex items-center gap-1 mb-2">
        <Label htmlFor="password" className="text-left text-white text-base">Password</Label>
        <Asterisk className="h-3 w-3 text-red-500" />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pl-10 bg-white/20 text-white backdrop-blur-md border-white/30 focus:border-[#D946EE] placeholder:text-white/50"
          placeholder="Enter your password"
          disabled={isLoading || isGoogleLoading}
          minLength={6}
        />
      </div>
    </div>
  );
};
