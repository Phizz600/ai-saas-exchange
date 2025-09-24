import { StatsCard } from "../StatsCard";
import { formatCurrency } from "@/lib/utils";
import { Handshake } from "lucide-react";

interface TransactionValueCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const TransactionValueCard = ({ value, change }: TransactionValueCardProps) => {
  return (
    <StatsCard
      title="Total Transaction Value"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : "accepted offers"}
      icon={<Handshake className="w-4 h-4 text-primary" />}
    />
  );
};