"use client";

import { countries, Country } from "@/src/utils/countries";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
  value?: string;
  onSelect: (country: Country) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onSelect, placeholder = "Select a country", className, disabled = false }) => {
  const handleValueChange = (countryName: string) => {
    const selected = countries.find((c) => c.name === countryName);
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className={cn("h-10 bg-(--input-color) rounded-lg p-3 dark:bg-page-body border-(--input-border-color) dark:border-zinc-700", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-(--card-color) border-(--input-border-color) dark:border-(--card-border-color) max-h-60">
        <SelectGroup>
          {countries.map((country) => (
            <SelectItem key={`${country.code}-${country.name}`} value={country.name} className="hover:bg-gray-100 dark:hover:bg-(--dark-sidebar) cursor-pointer">
              <div className="flex items-center justify-between w-full gap-2">
                <span>{country.name}</span>
                <span className="text-gray-400 text-xs">{country.dial_code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;
