/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { CustomField, CustomFieldType } from "@/src/types/components";
import { ColumnModalSchema } from "@/src/utils/validationSchema";
import { useFormik } from "formik";
import { Loader2, Plus, X } from "lucide-react";
import React, { useState } from "react";

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<CustomField>) => Promise<void>;
  column?: CustomField | null;
  isLoading: boolean;
}

const fieldTypesData = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Boolean", value: "boolean" },
  { label: "Select", value: "select" },
  { label: "Textarea", value: "textarea" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
];

const ColumnModal: React.FC<ColumnModalProps> = ({ isOpen, onClose, onSave, column, isLoading }) => {
  const fieldTypes: CustomFieldType[] = fieldTypesData || [];

  const [newOption, setNewOption] = useState("");

  const generateNameFromLabel = (labelText: string) => {
    return labelText
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const formik = useFormik({
    initialValues: {
      label: column?.label || "",
      name: column?.name || "",
      type: column?.type || "",
      is_active: column?.is_active ?? true,
      is_required: column?.required ?? false,
      placeholder: column?.placeholder || "",
      description: column?.description || "",
      min_length: column?.min_length,
      max_length: column?.max_length,
      min_value: column?.min_value,
      max_value: column?.max_value,
      options: column?.options || [],
    },
    validationSchema: ColumnModalSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload: Partial<CustomField> = {
        label: values.label.trim(),
        name: values.name.trim() || generateNameFromLabel(values.label),
        type: values.type,
        is_active: values.is_active,
        required: values.is_required,
        placeholder: values.placeholder.trim(),
        description: values.description.trim(),
      };

      const type = values.type.toUpperCase();
      if (type === "TEXT" || type === "TEXTAREA") {
        if (values.min_length !== undefined) payload.min_length = values.min_length;
        if (values.max_length !== undefined) payload.max_length = values.max_length;
      } else if (type === "NUMBER") {
        if (values.min_value !== undefined) payload.min_value = values.min_value;
        if (values.max_value !== undefined) payload.max_value = values.max_value;
      } else if (type === "SELECT") {
        payload.options = values.options;
      }

      await onSave(payload);
      formik.resetForm();
      onClose();
    },
  });

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !formik.values.options.includes(trimmed)) {
      formik.setFieldValue("options", [...formik.values.options, trimmed]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    formik.setFieldValue(
      "options",
      formik.values.options.filter((_, i) => i !== index)
    );
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    formik.setFieldValue("label", value);
    if (!column) {
      formik.setFieldValue("name", generateNameFromLabel(value));
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          formik.resetForm();
          onClose();
        }
      }}
    >
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <div>
            <AlertDialogTitle className="text-xl font-bold">{column ? "Edit Column" : "Create Column"}</AlertDialogTitle>
          </div>
          <Button
            type="button"
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
            className="p-1 hover:bg-gray-100 bg-gray-200 rounded-lg dark:bg-transparent transition-colors absolute right-4 top-4 dark:hover:bg-(--table-hover)"
          >
            <X size={20} className="dark:text-gray-400 text-slate-500" />
          </Button>
        </AlertDialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Label</Label>
            <Input name="label" placeholder="Enter column label" value={formik.values.label} onChange={handleLabelChange} onBlur={formik.handleBlur} className={`h-11 focus:border-none bg-(--input-color) dark:border-(--card-border-color) dark:bg-(--page-body-bg) focus-visible:shadow-none border-(--input-border-color) ${formik.touched.label && formik.errors.label ? "border-red-500" : ""}`} autoFocus />
            {formik.touched.label && formik.errors.label && <p className="text-xs text-red-500">{formik.errors.label}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Name (Slug)</Label>
            <Input name="name" placeholder="Auto-generated from label" value={formik.values.name} onChange={formik.handleChange} className="h-11 focus:border-none bg-(--input-color) focus-visible:shadow-none dark:border-(--card-border-color) dark:bg-(--page-body-bg) border-(--input-border-color)" readOnly />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Type</Label>
            <Select value={formik.values.type || undefined} onValueChange={(val) => formik.setFieldValue("type", val)}>
              <SelectTrigger className={`h-11 border-(--input-border-color) dark:bg-(--page-body-bg) w-full dark:border-(--card-border-color) bg-(--input-color) dark:hover:bg-(--page-body-bg) ${formik.touched.type && formik.errors.type ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent position="popper" className="dark:bg-(--page-body-bg)" sideOffset={4}>
                {(Array.isArray(fieldTypes) ? fieldTypes : []).map((ft: any, index: number) => {
                  const val = typeof ft === "string" ? ft : ft?.type || ft?.value || ft?.id || ft?.code;
                  const label = typeof ft === "string" ? ft : ft?.label || ft?.name || val;
                  if (!val) return null;
                  return (
                    <SelectItem key={index} value={String(val)} className="dark:hover:bg-(--table-hover)">
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {formik.touched.type && formik.errors.type && <p className="text-xs text-red-500">{formik.errors.type}</p>}
          </div>

          {formik.values.type.toUpperCase() === "SELECT" && (
            <div className="space-y-4">
              <Label className="text-sm font-semibold">Options</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add an option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="h-11 focus:border-none focus-visible:shadow-none border-(--input-border-color)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddOption} variant="outline" size="icon" className="h-11 w-11 shrink-0">
                  <Plus size={20} />
                </Button>
              </div>
              {formik.values.type.toUpperCase() === "SELECT" && formik.errors.options && <p className="text-xs text-red-500">{formik.errors.options as string}</p>}

              {formik.values.options.length > 0 && (
                <div className="p-4 border border-(--input-border-color) rounded-lg space-y-3">
                  <p className="text-xs text-gray-500">
                    {formik.values.options.length} {formik.values.options.length === 1 ? "option" : "options"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formik.values.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium border border-(--input-border-color) group">
                        <span>{option}</span>
                        <button type="button" onClick={() => handleRemoveOption(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 justify-between flex-wrap">
            <div className="p-4 border border-(--input-border-color) rounded-lg flex items-center justify-between dark:border-(--card-border-color)">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Required</p>
                <p className="text-xs text-gray-500">Make this field mandatory</p>
              </div>
              <Switch checked={formik.values.is_required} onCheckedChange={(val) => formik.setFieldValue("is_required", val)} />
            </div>

            <div className="p-4 border border-(--input-border-color) rounded-lg flex items-center justify-between dark:border-(--card-border-color)">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Visibility</p>
                <p className="text-xs text-gray-500">Make this column visible to users</p>
              </div>
              <Switch checked={formik.values.is_active} onCheckedChange={(val) => formik.setFieldValue("is_active", val)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Placeholder</Label>
            <Input name="placeholder" placeholder="Enter placeholder text" value={formik.values.placeholder} onChange={formik.handleChange} className="h-11 focus:border-none focus-visible:shadow-none border-(--input-border-color) bg-(--input-color) dark:bg-(--page-body-bg) dark:border-(--card-border-color)" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Description</Label>
            <Input name="description" placeholder="Enter description" value={formik.values.description} onChange={formik.handleChange} className="h-11 focus:border-none focus-visible:shadow-none border-(--input-border-color) bg-(--input-color) dark:bg-(--page-body-bg) dark:border-(--card-border-color)" />
          </div>

          {(formik.values.type.toUpperCase() === "TEXT" || formik.values.type.toUpperCase() === "TEXTAREA") && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Min Length</Label>
                <Input type="number" name="min_length" placeholder="0" value={formik.values.min_length ?? ""} onChange={(e) => formik.setFieldValue("min_length", e.target.value ? Number(e.target.value) : undefined)} className="h-11 focus:border-none focus-visible:shadow-none border-(--input-border-color) dark:border-(--card-border-color)" min="0" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Max Length</Label>
                <Input type="number" name="max_length" placeholder="100" value={formik.values.max_length ?? ""} onChange={(e) => formik.setFieldValue("max_length", e.target.value ? Number(e.target.value) : undefined)} className="h-11 focus:border-none focus-visible:shadow-none border-(--input-border-color) dark:border-(--card-border-color)" min="0" />
              </div>
            </div>
          )}

          {formik.values.type.toUpperCase() === "NUMBER" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Min Value</Label>
                <Input type="number" name="min_value" placeholder="0" value={formik.values.min_value ?? ""} onChange={(e) => formik.setFieldValue("min_value", e.target.value ? Number(e.target.value) : undefined)} className="h-11 border-(--input-border-color)" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Max Value</Label>
                <Input type="number" name="max_value" placeholder="100" value={formik.values.max_value ?? ""} onChange={(e) => formik.setFieldValue("max_value", e.target.value ? Number(e.target.value) : undefined)} className="h-11 border-(--input-border-color)" />
              </div>
            </div>
          )}

          <AlertDialogFooter className="sm:justify-end pt-4">
            <Button type="submit" disabled={isLoading} className="bg-primary text-white px-8 h-10 font-semibold">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{column ? "Updating..." : "Creating..."}</span>
                </div>
              ) : column ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ColumnModal;
