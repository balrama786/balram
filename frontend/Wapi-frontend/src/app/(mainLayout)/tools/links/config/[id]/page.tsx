"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import CommonHeader from "@/src/shared/CommonHeader";
import ShortLinkForm from "@/src/components/tools/short-links/ShortLinkForm";
import ShortLinkSuccess from "@/src/components/tools/short-links/ShortLinkSuccess";
import { useGetShortLinkByIdQuery } from "@/src/redux/api/shortLinkApi";
import { ShortLinkData } from "@/src/types/short-link";
import { Loader2 } from "lucide-react";

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: response, isLoading } = useGetShortLinkByIdQuery(id);
  const [updatedData, setUpdatedData] = useState<ShortLinkData | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-slate-400 font-medium">Loading link details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8">
      {!updatedData && (
        <>
          <CommonHeader backBtn title="Edit WhatsApp Link" description="Update your direct chat link configuration and update QR code." />
          <div className="mx-auto">
            <ShortLinkForm initialData={response?.data} onSuccess={setUpdatedData} />
          </div>
        </>
      )}

      {updatedData && <ShortLinkSuccess data={updatedData} onReset={() => setUpdatedData(null)} />}
    </div>
  );
};

export default Page;
