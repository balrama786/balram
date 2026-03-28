"use client";

import ProductForm from "@/src/components/catalogue/ProductForm";
import { Button } from "@/src/elements/ui/button";
import {
  useGetProductsFromCatalogQuery,
  useUpdateProductInCatalogMutation,
} from "@/src/redux/api/catalogueApi";
import { Loader2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { clearEditingProduct } from "@/src/redux/reducers/catalogueSlice";
import { ProductPayload } from "@/src/types/components/catalogue";

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const catalogId = searchParams.get("catalog_id");
  const productId = params.id as string;
  const dispatch = useAppDispatch();

  // Optimized data flow: Get product from Redux store first
  const { editingProduct } = useAppSelector((state) => state.catalogue);

  // Fallback query only if direct product is not in store (e.g. on page refresh)
  const { data: productsResult, isLoading: isFetching, error: fetchError } = useGetProductsFromCatalogQuery(
    {
      catalog_id: catalogId!,
      // Backend might support search by external ID or we find in first page
      search: productId, 
    },
    { skip: !!editingProduct || !catalogId }
  );

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductInCatalogMutation();

  const product = editingProduct || productsResult?.data?.products?.find(
    (p) => p.product_external_id === productId
  );

  // Handle fetch error
  useEffect(() => {
    if (fetchError) {
      const err = fetchError as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Failed to fetch product details");
    }
  }, [fetchError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearEditingProduct());
    };
  }, [dispatch]);

  const handleSubmit = async (data: ProductPayload) => {
    if (!catalogId || !productId) return;

    try {
      await updateProduct({ catalog_id: catalogId, product_id: productId, data }).unwrap();
      toast.success("Product updated successfully");
      router.push(`/catalogues/manage?catalog_id=${catalogId}`);
    } catch (error: unknown) {
      const fetchError = error as { data?: { message?: string } };
      toast.error(fetchError?.data?.message || "Failed to update product");
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-gray-500">Fetching product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center py-20">
        <h3 className="text-lg font-semibold text-red-500">Product Not Found</h3>
        <p className="text-gray-500">{"We couldn't find the product details in the current catalogue."}</p>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <ProductForm
      title="Edit Product"
      initialData={product}
      onSubmit={handleSubmit}
      isLoading={isUpdating}
    />
  );
};

export default EditProductPage;
