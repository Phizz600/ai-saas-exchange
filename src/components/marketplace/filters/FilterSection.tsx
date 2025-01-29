import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterSectionProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export const FilterSection = ({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  disabled = false
}: FilterSectionProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-[140px] bg-gray-50/50 border-gray-200/50 hover:bg-gray-100/50 transition-colors">
        <SelectValue placeholder={placeholder || label} />
      </SelectTrigger>
      <SelectContent className="bg-white border shadow-lg">
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="hover:bg-gray-50 cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};