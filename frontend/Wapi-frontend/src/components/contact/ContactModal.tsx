/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { MultiSelect } from "@/src/elements/ui/multi-select";
import { Textarea } from "@/src/elements/ui/textarea";
import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import { Contact, CustomField, Tag } from "@/src/types/components";
import { ContactSchema } from "@/src/utils/validationSchema";
import { useFormik } from "formik";
import { Loader2, X } from "lucide-react";
import React from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Contact>) => Promise<void>;
  contact?: Contact | null;
  isLoading: boolean;
}

const mockAgents = [
  { id: "2", name: "john" },
  { id: "1", name: "jack" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "lead", label: "Lead" },
  { value: "customer", label: "Customer" },
  { value: "prospect", label: "Prospect" },
];

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, contact, isLoading }) => {
  const { data: tagsResult } = useGetTagsQuery({});
  const { data: customFieldsResult } = useGetCustomFieldsQuery({ page: 1, limit: 100 });

  const tags: Tag[] = tagsResult?.data?.tags || [];
  const customFields: CustomField[] = customFieldsResult?.data?.fields || [];

  const formik = useFormik({
    initialValues: {
      phone_number: contact?.phone_number || "",
      name: contact?.name || "",
      // assigned_to: contact?.assigned_to || "",
      tags: contact?.tags ? contact.tags.map((t) => (typeof t === "object" ? (t as any)._id || (t as any).value : t)) : [],
      email: contact?.email || "",
      status: contact?.status || "",
      custom_fields: contact?.custom_fields || {},
    },
    validationSchema: ContactSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSave(values);
      onClose();
      formik.resetForm();
    },
  });

  const handleCustomFieldChange = (key: string, value: any) => {
    formik.setFieldValue("custom_fields", {
      ...formik.values.custom_fields,
      [key]: value,
    });
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          formik.resetForm();
        }
      }}
    >
      <AlertDialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] max-w-[95vw] sm:w-full p-4 sm:p-6" size="lg">
        <AlertDialogHeader className="flex flex-row items-center justify-between pr-8">
          <AlertDialogTitle className="text-lg sm:text-xl font-bold">{contact ? "Edit Contact" : "Add Contact"}</AlertDialogTitle>
          <Button
            onClick={() => {
              onClose();
              formik.resetForm();
            }}
            className="p-1 hover:bg-gray-100 bg-gray-50 dark:bg-transparent rounded-lg transition-colors absolute right-4 top-4 dark:hover:bg-(--table-hover)"
          >
            <X size={20} className="dark:text-amber-50 text-gray-500" />
          </Button>
        </AlertDialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-4">
            {/* Main contact fields - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-sm">
                  Phone Number
                </Label>
                <div className="flex gap-2">
                  <Input id="phone_number" name="phone_number" placeholder="Enter phone number" value={formik.values.phone_number} onChange={formik.handleChange} onBlur={formik.handleBlur} className={formik.touched.phone_number && formik.errors.phone_number ? "border-red-500 bg-(--input-color)" : "bg-(--input-color) focus:bg-(--input-color)"} />
                </div>
                {formik.touched.phone_number && formik.errors.phone_number && <p className="text-xs text-red-500">{formik.errors.phone_number}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  Name
                </Label>
                <Input id="name" name="name" placeholder="Enter full name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} className={formik.touched.name && formik.errors.name ? "border-red-500 bg-(--input-color)" : "bg-(--input-color)"} />
                {formik.touched.name && formik.errors.name && <p className="text-xs text-red-500">{formik.errors.name}</p>}
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="assigned_to">Assigned To</Label>
                <Select value={formik.values.assigned_to} onValueChange={(val) => formik.setFieldValue("assigned_to", val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {mockAgents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm">
                  Tags
                </Label>
                <MultiSelect
                  options={tags.map((tag) => ({
                    label: tag.label,
                    value: tag._id,
                    color: tag.color,
                  }))}
                  selected={formik.values.tags || []}
                  onChange={(selected) => formik.setFieldValue("tags", selected)}
                  placeholder="Select tags..."
                  className="dark:bg-(--page-body-bg) bg-(--input-color) dark:border-none dark:focus:bg-(--page-body-bg) dark:hover:bg-(--page-body-bg)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input id="email" name="email" type="email" placeholder="Enter email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className={formik.touched.email && formik.errors.email ? "border-red-500 bg-(--input-color)" : "bg-(--input-color)"} />
                {formik.touched.email && formik.errors.email && <p className="text-xs text-red-500">{formik.errors.email}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2 md:col-span-1">
                <Label htmlFor="status" className="text-sm">
                  Status
                </Label>
                <Select value={formik.values.status} onValueChange={(val) => formik.setFieldValue("status", val)}>
                  <SelectTrigger className="w-full bg-(--input-color) dark:border-none dark:bg-(--page-body-bg) dark:focus:bg-(--page-body-bg) dark:hover:bg-(--page-body-bg)">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="dark:bg-(--page-body-bg)">
                    {statusOptions.map((status) => (
                      <SelectItem className="dark:hover:bg-(--card-color)" key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customFields.map((field) => {
                  const fieldType = field.type.toUpperCase();
                  return (
                    <div key={field._id} className="space-y-2">
                      {fieldType !== "BOOLEAN" && (
                        <Label htmlFor={field.name} className="text-sm">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                      )}
                      {fieldType === "SELECT" ? (
                        <Select value={formik.values.custom_fields?.[field.name] || ""} onValueChange={(val) => handleCustomFieldChange(field.name, val)} required={field.required || false}>
                          <SelectTrigger className="w-full bg-(--input-color) dark:bg-(--page-body-bg)">
                            <SelectValue placeholder={`Select ${field.placeholder || field.label}`} />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {field.options?.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : fieldType === "TEXTAREA" ? (
                        <Textarea id={field.name} placeholder={`Enter ${field.placeholder || field.label}`} value={formik.values.custom_fields?.[field.name] || ""} onChange={(e) => handleCustomFieldChange(field.name, e.target.value)} minLength={field.min_length ?? undefined} maxLength={field.max_length ?? undefined} required={field.required || false} className="bg-(--input-color) min-h-[80px]" />
                      ) : fieldType === "BOOLEAN" ? (
                        <div className="flex items-center space-x-3 pt-2">
                          <Checkbox id={field.name} checked={Boolean(formik.values.custom_fields?.[field.name])} onCheckedChange={(checked) => handleCustomFieldChange(field.name, checked === true)} required={field.required || false} />
                          <Label htmlFor={field.name} className="cursor-pointer text-sm font-normal">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                        </div>
                      ) : (
                        <Input className="bg-(--input-color)" id={field.name} placeholder={`Enter ${field.placeholder || field.label}`} value={formik.values.custom_fields?.[field.name] || ""} onChange={(e) => handleCustomFieldChange(field.name, e.target.value)} type={field.type.toLowerCase()} min={fieldType === "NUMBER" ? field.min_value ?? undefined : undefined} max={fieldType === "NUMBER" ? field.max_value ?? undefined : undefined} minLength={fieldType !== "NUMBER" ? field.min_length ?? undefined : undefined} maxLength={fieldType !== "NUMBER" ? field.max_length ?? undefined : undefined} required={field.required || false} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">

            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary text-white w-full sm:w-auto px-8 order-1 sm:order-2">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : contact ? (
                "Update Contact"
              ) : (
                "Create Contact"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContactModal;
