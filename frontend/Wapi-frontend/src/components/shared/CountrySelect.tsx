"use client";

import { COUNTRIES } from "../../constants/countries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../elements/ui/select";
import { cn } from "../../lib/utils";
import { MapPin } from "lucide-react";
import React from "react";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: React.FocusEventHandler;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ disabled, value, onChange, onBlur, error, touched, placeholder = "Select country", className, id, name, icon = <MapPin className="w-5 h-5" /> }) => {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative group">
        <Select value={value} onValueChange={onChange} name={name} disabled={disabled}>
          <SelectTrigger id={id} onBlur={onBlur} className={cn("h-11 py-5.5 border border-(--input-border-color) dark:border-none dark:bg-(--page-body-bg) focus:border-primary rounded-lg bg-white dark:hover:bg-transparent transition-all w-full text-left", touched && error ? "border-red-500 focus:ring-red-500/10" : "")}>
            <SelectValue placeholder={placeholder}>
              {value ? (
                <div className="flex items-center gap-2">
                  <span className="truncate">{value}</span>
                </div>
              ) : (
                <span className="text-slate-400">{placeholder}</span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60 rounded-lg dark:bg-(--card-color) dark:border-(--card-border-color) border-slate-200 shadow-xl overflow-y-auto z-50">
            {COUNTRIES.map((country) => (
              <SelectItem key={country.code} value={country.name} className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-(--table-hover) transition-colors py-2 px-3 rounded-md mx-1 my-0.5">
                <div className="flex items-center justify-between w-full gap-2">
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="text-xs text-slate-400 font-mono">{country.dial_code}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {touched && error && <p className="text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
};
