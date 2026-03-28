/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { useConnectWhatsAppMutation } from "@/src/redux/api/whatsappApi";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setWorkspace } from "@/src/redux/reducers/workspaceSlice";
import { ManualConnectionSchema } from "@/src/utils/validationSchema";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "sonner";

interface ManualConnectionKeysProps {
  isDisabled?: boolean;
}

const ManualConnectionKeys = ({ isDisabled }: ManualConnectionKeysProps) => {
  const [connectWhatsApp, { isLoading }] = useConnectWhatsAppMutation();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const { refetch: refetchWorkspaces } = useGetWorkspacesQuery();
  const dispatch = useAppDispatch();
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      phoneNumberId: "",
      whatsappBusinessId: "",
      appId: "",
      registeredPhoneNumber: "",
      businessId: "",
      accessToken: "",
    },
    validationSchema: ManualConnectionSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setApiError("");
        setSuccessMessage("");

        const response = await connectWhatsApp({
          phone_number_id: values.phoneNumberId,
          whatsapp_business_account_id: values.whatsappBusinessId,
          app_id: values.appId,
          registred_phone_number: values.registeredPhoneNumber,
          business_id: values.businessId,
          access_token: values.accessToken,
          workspace_id: selectedWorkspace?._id,
        }).unwrap();

        if (response.success) {
          setSuccessMessage("WhatsApp connected successfully!");
          toast.success("WhatsApp connected successfully");

          // Refetch and sync workspace state
          const { data: updatedWorkspaces } = await refetchWorkspaces();
          if (updatedWorkspaces?.data) {
            const currentWs = updatedWorkspaces.data.find((ws: any) => ws._id === selectedWorkspace?._id);
            if (currentWs) {
              dispatch(setWorkspace(currentWs));
            }
          }
        }
        resetForm();
      } catch (error: any) {
        const errorMessage = error?.data?.message || "Failed to connect WhatsApp. Please try again.";
        setApiError(errorMessage);
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setApiError("");
    setSuccessMessage("");
  };

  return (
    <Card className="border-gray-100 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden">
      <CardContent className="p-4 sm:p-6  space-y-8">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-300">Manual Connection Keys</h3>
          <p className="text-gray-500 text-sm">Configure your meta developer credentials to sync with your business account.</p>
        </div>

        {successMessage && (
          <div className="p-4 bg-green-50 border dark:bg-(--dark-sidebar) dark:border-(--card-border-color) border-green-200 rounded-lg">
            <p className="text-sm text-primary font-medium">{successMessage}</p>
          </div>
        )}

        {apiError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">{apiError}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                  Phone Number ID <span className="text-red-500">*</span>
                </Label>
                <Input name="phoneNumberId" placeholder="e.g. 109283746509182" className={`h-11 border-(--input-border-color) bg-(--input-color) focus:border-primary dark:border-(--card-border-color) focus:ring-primary ${formik.touched.phoneNumberId && formik.errors.phoneNumberId ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} value={formik.values.phoneNumberId} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={isLoading || isDisabled} />
                {formik.touched.phoneNumberId && formik.errors.phoneNumberId && <p className="text-xs text-red-600">{formik.errors.phoneNumberId}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                  WhatsApp Business ID <span className="text-red-500">*</span>
                </Label>
                <Input name="whatsappBusinessId" placeholder="e.g. 982734615243" className={`h-11 border-(--input-border-color) bg-(--input-color) dark:border-(--card-border-color) focus:border-primary focus:ring-primary ${formik.touched.whatsappBusinessId && formik.errors.whatsappBusinessId ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} value={formik.values.whatsappBusinessId} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={isLoading || isDisabled} />
                {formik.touched.whatsappBusinessId && formik.errors.whatsappBusinessId && <p className="text-xs text-red-600">{formik.errors.whatsappBusinessId}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                  App ID <span className="text-red-500">*</span>
                </Label>
                <Input name="appId" placeholder="e.g. 88392019485" className={`h-11 border-(--input-border-color) bg-(--input-color) dark:border-(--card-border-color) focus:border-primary focus:ring-primary ${formik.touched.appId && formik.errors.appId ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} value={formik.values.appId} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={isLoading || isDisabled} />
                {formik.touched.appId && formik.errors.appId && <p className="text-xs text-red-600">{formik.errors.appId}</p>}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                  Registered Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input name="registeredPhoneNumber" placeholder="+1 (555) 000-0000" className={`h-11 border-(--input-border-color) bg-(--input-color) dark:border-(--card-border-color) focus:border-primary focus:ring-green-500/20 ${formik.touched.registeredPhoneNumber && formik.errors.registeredPhoneNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} value={formik.values.registeredPhoneNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={isLoading || isDisabled} />
                {formik.touched.registeredPhoneNumber && formik.errors.registeredPhoneNumber && <p className="text-xs text-red-600">{formik.errors.registeredPhoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                  Business ID <span className="text-red-500">*</span>
                </Label>
                <Input name="businessId" placeholder="e.g. 123456789" className={`h-11 border-(--input-border-color) bg-(--input-color) dark:border-(--card-border-color) focus:border-primary focus:ring-green-500/20 ${formik.touched.businessId && formik.errors.businessId ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} value={formik.values.businessId} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={isLoading || isDisabled} />
                {formik.touched.businessId && formik.errors.businessId && <p className="text-xs text-red-600">{formik.errors.businessId}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                  Access Token <span className="text-red-500">*</span>
                </Label>
                <Textarea name="accessToken" placeholder="Paste your permanent access token here..." className={`min-h-11 bg-(--input-color) dark:border-(--card-border-color) dark:bg-(--page-body-bg) border-(--input-border-color) focus:border-primary focus:ring-green-500/20 resize-none ${formik.touched.accessToken && formik.errors.accessToken ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} value={formik.values.accessToken} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={isLoading || isDisabled} />
                {formik.touched.accessToken && formik.errors.accessToken && <p className="text-xs text-red-600">{formik.errors.accessToken}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 dark:border-(--card-border-color) flex-wrap">
            <Button type="button" variant="outline" className="h-11 px-8 cursor-pointer border-(--input-border-color) dark:border-none text-gray-700 dark:text-amber-50 font-semibold hover:bg-gray-50" onClick={handleCancel} disabled={isLoading || isDisabled}>
              Cancel
            </Button>
            <Button type="submit" className="h-11 px-8 bg-primary cursor-pointer text-white font-semibold hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || !formik.isValid || isDisabled}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualConnectionKeys;
