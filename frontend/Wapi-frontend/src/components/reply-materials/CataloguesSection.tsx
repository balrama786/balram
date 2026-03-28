/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { useGetLinkedCatalogsQuery, useGetWABACatalogsQuery, useLinkCatalogToWABAMutation, useSyncCatalogsMutation } from "@/src/redux/api/catalogueApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { AvailableCatalogue } from "@/src/types/components/catalogue";
import { CheckCircle2, Link2, Loader2, Package, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface CataloguesSectionProps {
  wabaId: string;
  onToggleSidebar?: () => void;
}

const CataloguesSection: React.FC<CataloguesSectionProps> = ({ wabaId, onToggleSidebar }) => {
  const router = useRouter();
  const [linkCatalogId, setLinkCatalogId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [linkCatalog, { isLoading: isLinking }] = useLinkCatalogToWABAMutation();
  const [syncCatalogs, { isLoading: isSyncing }] = useSyncCatalogsMutation();

  const { data: catalogsResult, isLoading: isCatalogsLoading, refetch: refetchCatalogs, error: catalystsError } = useGetWABACatalogsQuery({ waba_id: wabaId || "" }, { skip: !wabaId });
  const availableCatalogs = useMemo(() => catalogsResult?.data?.data || [], [catalogsResult?.data?.data]);

  const { data: linkedCatalogsResult, isLoading: isLinkedLoading, refetch: refetchLinked, error: linkedError } = useGetLinkedCatalogsQuery({ waba_id: wabaId || "" }, { skip: !wabaId });
  const linkedCatalogs = linkedCatalogsResult?.data?.catalogs || [];
  const linkedCatalogIds = new Set(linkedCatalogs.map((c: any) => c._id));

  const filteredCatalogs = useMemo(() => {
    if (!searchTerm) return availableCatalogs;
    const lowerSearch = searchTerm.toLowerCase();
    return availableCatalogs.filter((c: AvailableCatalogue) => c.name.toLowerCase().includes(lowerSearch) || c.id.toLowerCase().includes(lowerSearch));
  }, [availableCatalogs, searchTerm]);

  useEffect(() => {
    if (catalystsError || linkedError) {
      const err = (catalystsError || linkedError) as { data?: { message?: string }; message?: string };
      const message = err?.data?.message || err?.message || "Failed to fetch catalogues";
      toast.error(message, { id: "catalogue-fetch-error" });
    }
  }, [catalystsError, linkedError]);

  const handleLink = async () => {
    if (linkCatalogId && wabaId) {
      try {
        await linkCatalog({
          waba_id: wabaId,
          catalog_id: linkCatalogId,
        }).unwrap();
        toast.success("Catalog linked successfully");
        setLinkCatalogId(null);
        refetchLinked();
      } catch (error: unknown) {
        const fetchError = error as { data?: { message?: string } };
        toast.error(fetchError?.data?.message || "Failed to link catalog");
      }
    }
  };

  const handleManageProducts = () => {
    if (linkedCatalogs.length > 0) {
      const catalogDbId = linkedCatalogs[0]._id;
      router.push(`/catalogues/manage?catalog_id=${catalogDbId}`);
    }
  };

  const handleSyncCatalogs = async () => {
    if (!wabaId) return;
    try {
      await syncCatalogs({ waba_id: wabaId }).unwrap();
      toast.success("Catalogs synced successfully");
      refetchCatalogs();
      refetchLinked();
    } catch (error: unknown) {
      const fetchError = error as { data?: { message?: string } };
      toast.error(fetchError?.data?.message || "Failed to sync catalogs");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 sm:p-6 p-4 overflow-y-auto custom-scrollbar">
      <CommonHeader
        title="Catalogues"
        description="Manage your Facebook Business catalogues and link them to your WABA"
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        searchPlaceholder="Search catalogues..."
        onRefresh={() => {
          refetchCatalogs();
          refetchLinked();
        }}
        onSync={handleSyncCatalogs}
        isLoading={isCatalogsLoading || isLinkedLoading || isSyncing}
        onToggleSidebar={onToggleSidebar}
        rightContent={
          <div className="flex items-center gap-3 flex-wrap ml-auto sm:ml-0 rtl:mr-auto rtl:ml-0">
            <Button onClick={handleManageProducts} disabled={linkedCatalogs.length === 0} className="flex ltr:ml-auto rtl:mr-auto ltr:sm:ml-0 rtl:sm:mr-0 items-center gap-2 px-5 bg-primary text-white h-12 rounded-lg font-bold transition-all active:scale-95 group">
              <Package size={18} className="group-hover:scale-110 transition-transform" />
              <span>Manage Products</span>
            </Button>
          </div>
        }
      />

      <div className="mt-8 flex-1">
        {isCatalogsLoading || isLinkedLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-gray-500">Loading catalogues...</p>
          </div>
        ) : catalystsError || linkedError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-red-50/30 rounded-lg border-2 border-dashed border-red-100 dark:bg-(--card-color) dark:border-(--card-border-color)">
            <div className="p-4 bg-red-50 rounded-lg text-red-400 dark:text-red-800 mb-4 dark:bg-red-900/20">
              <ShoppingBag size={48} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Error fetching catalogues</h3>
            <p className="text-gray-500 max-w-xs text-center mt-2">{"We encountered an error while trying to fetch catalogues for this WABA."}</p>
            <Button
              variant="outline"
              onClick={() => {
                refetchCatalogs();
                refetchLinked();
              }}
              className="mt-6 px-4.5 py-5"
            >
              Try Again
            </Button>
          </div>
        ) : filteredCatalogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredCatalogs.map((catalog: AvailableCatalogue) => {
              const isLinked = linkedCatalogIds.has(catalog._id);
              return (
                <Card key={catalog._id} className={`group relative overflow-hidden transition-all duration-300 border shadow-sm hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 rounded-lg ${isLinked ? "border-primary/20 bg-primary/2 dark:bg-primary/5" : "border-slate-100 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) hover:border-primary/30"}`}>
                  <CardHeader className="p-5 pb-0">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg transition-colors duration-300 ${isLinked ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"}`}>
                        <ShoppingBag size={22} className="transition-transform group-hover:scale-110" />
                      </div>
                      {isLinked && (
                        <Badge className="bg-emerald-50 text-primary border-none px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider dark:bg-emerald-900/20 dark:text-emerald-400">
                          <CheckCircle2 size={12} className="ltr:mr-1.5 rtl:ml-1.5" /> Linked
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors leading-tight truncate pr-2 uppercase tracking-tight" title={catalog.name}>
                      {catalog.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 pt-3 space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Catalog ID</span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-(--dark-body) dark:text-gray-500 px-2 py-0.5 rounded-md">{catalog.catalog_id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-(--table-hover) rounded-lg border border-slate-100/50 dark:border-none">
                      <div className="p-1.5 bg-white dark:bg-(--dark-body) rounded-lg shadow-sm">
                        <Package size={14} className="text-slate-400 dark:text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{catalog.product_count}</span>
                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Products Available</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0">
                    <Button variant={isLinked ? "secondary" : "outline"} className={`w-full h-11 gap-2.5 rounded-lg font-semibold transition-all duration-300 ${isLinked ? "bg-slate-100 dark:bg-(--table-hover) dark:text-gray-400 text-slate-400 cursor-default border-none hover:bg-slate-100" : "border-slate-200 dark:border-none hover:bg-primary hover:text-white hover:border-primary active:scale-[0.98]"}`} onClick={() => !isLinked && setLinkCatalogId(catalog._id)} disabled={isLinked}>
                      {isLinked ? (
                        <>
                          <CheckCircle2 size={18} />
                          Linked to WABA
                        </>
                      ) : (
                        <>
                          <Link2 size={18} className="group-hover:ltr:-rotate-45 group-hover:rtl:rotate-45 transition-transform" />
                          Link this Catalog
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-100 dark:bg-(--card-color) dark:border-(--card-border-color)">
            <div className="p-4 bg-gray-100 rounded-full text-gray-400 mb-4 dark:bg-(--dark-body)">
              <ShoppingBag size={48} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{searchTerm ? `No results for "${searchTerm}"` : "No catalogues found"}</h3>
            <p className="text-gray-500 max-w-xs text-center mt-2">{searchTerm ? "Try searching for a different name or ID, or ensure the correct WABA is selected." : "We couldn't find any Facebook catalogues associated with this WABA."}</p>
            {searchTerm && (
              <Button variant="ghost" className="mt-4 text-primary font-bold" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>

      <ConfirmModal isOpen={!!linkCatalogId} onClose={() => setLinkCatalogId(null)} onConfirm={handleLink} isLoading={isLinking} title="Link Catalogue" subtitle="Are you sure you want to link this catalogue to your WhatsApp Business Account? This will allow you to share products from this catalogue with your customers." confirmText="Confirm Link" variant="primary" />
    </div>
  );
};

export default CataloguesSection;
