/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useGetProductsFromCatalogQuery, useGetWABACatalogsQuery } from "@/src/redux/api/catalogueApi";
import { Loader2, Package, ShoppingBag, Store } from "lucide-react";
import { useState } from "react";

// ─── Catalog Product Picker (single product for catalog templates) ────────────

export const CatalogProductPicker = ({ wabaId, value, onChange }: { wabaId: string; value: string; onChange: (val: string) => void }) => {
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");

  const { data: catalogsResult, isLoading: loadingCatalogs } = useGetWABACatalogsQuery({ waba_id: wabaId }, { skip: !wabaId });
  const catalogs = catalogsResult?.data?.data || [];
  const catalogId = catalogs.find((item: any) => item.catalog_id === selectedCatalogId);
  const { data: productsResult, isLoading: loadingProducts } = useGetProductsFromCatalogQuery({ catalog_id: catalogId?._id || selectedCatalogId, limit: 100 }, { skip: !selectedCatalogId });

  const availableProducts = productsResult?.data?.products || [];

  return (
    <div className="space-y-5">
      {/* Catalogue Selector */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Store size={11} /> Select Catalogue
        </Label>
        {loadingCatalogs ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
            <Loader2 size={14} className="animate-spin" /> Loading catalogues...
          </div>
        ) : catalogs.length === 0 ? (
          <div className="text-sm text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl p-3">No catalogues linked to this WABA. Please link a catalogue first.</div>
        ) : (
          <Select value={selectedCatalogId} onValueChange={setSelectedCatalogId}>
            <SelectTrigger className="h-11 bg-slate-50 dark:bg-(--dark-body) rounded-xl">
              <SelectValue placeholder="Choose a catalogue..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {catalogs.map((cat: any) => (
                <SelectItem key={cat.catalog_id} value={cat.catalog_id}>
                  <div className="flex items-center gap-2">
                    <Store size={13} className="text-slate-400" />
                    <span className="font-bold">{cat.name}</span>
                    <span className="text-xs text-slate-400">({cat.product_count} products)</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Product Selector */}
      {selectedCatalogId && (
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingBag size={11} /> Select Product
          </Label>
          {loadingProducts ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
              <Loader2 size={14} className="animate-spin" /> Loading products...
            </div>
          ) : availableProducts.length === 0 ? (
            <div className="text-sm text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl p-3">No products found in this catalogue.</div>
          ) : (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="h-11 bg-slate-50 dark:bg-(--dark-body) rounded-xl">
                <SelectValue placeholder="Choose a product..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {availableProducts.map((prod: any) => (
                  <SelectItem key={prod._id} value={prod.retailer_id}>
                    <div className="flex items-center gap-2">
                      <Package size={13} className="text-slate-400" />
                      <span className="font-bold">{prod.name}</span>
                      <span className="text-xs text-slate-400">({prod.retailer_id})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Manual Retailer ID input */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Package size={11} /> Or enter Retailer ID manually
        </Label>
        <Input placeholder="e.g. q8e62ppjgz" value={value} onChange={(e) => onChange(e.target.value)} className="h-11 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg" />
      </div>
    </div>
  );
};
