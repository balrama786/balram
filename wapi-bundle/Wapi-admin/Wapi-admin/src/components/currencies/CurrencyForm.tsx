/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { useCreateCurrencyMutation, useGetCurrencyByIdQuery, useUpdateCurrencyMutation } from "@/src/redux/api/currencyApi";
import { currencies } from "@/src/utils/currencies";
import { ArrowLeft, Check, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CurrencyFormProps {
  id?: string;
}

const CurrencyForm = ({ id }: CurrencyFormProps) => {
  const router = useRouter();
  const isEditMode = !!id;

  const [createCurrency, { isLoading: isCreating }] = useCreateCurrencyMutation();
  const [updateCurrency, { isLoading: isUpdating }] = useUpdateCurrencyMutation();
  const { data: currencyData, isLoading: isLoadingCurrency } = useGetCurrencyByIdQuery(id || "", { skip: !isEditMode });

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [decimalNumber, setDecimalNumber] = useState<number>(2);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isEditMode && currencyData?.data) {
      const curr = currencyData.data;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(curr.name);
      setCode(curr.code);
      setSymbol(curr.symbol);
      setExchangeRate(curr.exchange_rate);
      setDecimalNumber(curr.decimal_number);
      setIsActive(curr.is_active);
    }
  }, [isEditMode, currencyData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !symbol) {
      toast.error("Name, Code and Symbol are required.");
      return;
    }

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      symbol: symbol.trim(),
      exchange_rate: Number(exchangeRate),
      decimal_number: Number(decimalNumber),
      is_active: isActive,
    };

    try {
      if (isEditMode) {
        await updateCurrency({ id: id as string, data: payload }).unwrap();
        toast.success("Currency updated successfully.");
      } else {
        await createCurrency(payload).unwrap();
        toast.success("Currency created successfully.");
      }
      router.push("/currencies");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.error || error?.error || "Something went wrong.");
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingCurrency;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) transition-all">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-(--text-green-primary) mb-2">{isEditMode ? "Edit Currency" : "Add New Currency"}</h1>
            <p className="text-gray-400 text-sm">{isEditMode ? "Update currency details." : "Create a new currency for your system."}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-(--card-color) dark:border-(--card-border-color) sm:p-6 p-4">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Coins className="w-5 h-5 shadow-inner" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Currency Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Code Select */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="code" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                  Select Currency Code <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={code}
                  onValueChange={(val) => {
                    setCode(val);
                    const selected = currencies.find((c) => c.code === val);
                    if (selected) {
                      if (!name) setName(selected.name);
                      if (!symbol) setSymbol(selected.symbol);
                    }
                  }}
                >
                  <SelectTrigger className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg border-gray-200">
                    <SelectValue placeholder="Select currency code" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 dark:bg-(--card-color)">
                    {currencies.map((curr) => (
                      <SelectItem className="dark:hover:bg-(--table-hover)" key={curr.code} value={curr.code}>
                        {curr.code} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Symbol Select */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="symbol" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                  Currency Symbol <span className="text-red-500">*</span>
                </Label>
                <Select value={symbol} onValueChange={setSymbol}>
                  <SelectTrigger className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg border-gray-200">
                    <SelectValue placeholder="Select symbol" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 dark:bg-(--card-color)">
                    {/* Unique set of symbols from the list */}
                    {Array.from(new Set(currencies.map((c) => c.symbol))).map((s) => (
                      <SelectItem className="dark:hover:bg-(--table-hover)" key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Name Input */}
              <div className="space-y-2 flex flex-col md:col-span-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                  Currency Name <span className="text-red-500">*</span>
                </Label>
                <Input id="name" placeholder="e.g. US Dollar" value={name} onChange={(e) => setName(e.target.value)} className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg" required />
              </div>

              {/* Exchange Rate */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="exchangeRate" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                  Exchange Rate (1 USD = ?) <span className="text-red-500">*</span>
                </Label>
                <Input id="exchangeRate" type="number" step="0.0001" value={exchangeRate} onChange={(e) => setExchangeRate(Number(e.target.value))} className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg" required />
              </div>

              {/* Decimal Number */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="decimalNumber" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                  Decimal Number <span className="text-red-500">*</span>
                </Label>
                <Input id="decimalNumber" type="number" value={decimalNumber} onChange={(e) => setDecimalNumber(Number(e.target.value))} className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg" required />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-page-body rounded-lg border border-gray-100 dark:border-none transition-all md:col-span-2">
                <div>
                  <Label htmlFor="isActive" className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                    Active State
                  </Label>
                  <p className="text-xs text-gray-500">Allow system to use this currency</p>
                </div>
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-(--text-green-primary)" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()} className="px-4.5 py-5 h-12 border-gray-200 dark:bg-(--card-color) dark:border-none dark:text-slate-300 hover:bg-gray-50 rounded-lg font-medium dark:hover:bg-(--table-hover) transition-all" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="px-4.5 py-5 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg dark:shadow-none transition-all active:scale-95 disabled:opacity-50 min-w-40" disabled={isLoading || !name || !code || !symbol}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isEditMode ? "Saving..." : "Creating..."}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-white" />
                  <span>{isEditMode ? "Save Changes" : "Create Currency"}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurrencyForm;
