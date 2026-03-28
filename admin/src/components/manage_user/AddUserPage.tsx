"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { Textarea } from "@/src/elements/ui/textarea";
import { useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from "@/src/redux/api/userApi";
import { CreateUserPayload, UpdateUserPayload } from "@/src/types/store";
import { ArrowLeft, Save, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import CountrySelect from "@/src/shared/CountrySelect";
import { Country } from "@/src/utils/countries";

interface AddUserPageProps {
  id?: string;
}

type FormState = {
  name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  country_code: string;
  note: string;
  status: boolean;
};

const AddUserPage = ({ id }: AddUserPageProps) => {
  const router = useRouter();
  const isEditMode = !!id;

  const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(id ?? "", { skip: !id });
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isSubmitting = isCreating || isUpdating;

  const initialForm = useMemo<FormState>(() => {
    if (isEditMode && userData?.data) {
      const u = userData.data;
      return {
        name: u.name ?? "",
        email: u.email ?? "",
        password: "",
        phone: u.phone ?? "",
        country: u.country ?? "",
        country_code: u.country_code ?? "",
        note: u.note ?? "",
        status: u.status,
      };
    }
    return { name: "", email: "", password: "", phone: "", country: "", country_code: "", note: "", status: true };
  }, [isEditMode, userData]);

  const [form, setForm] = useState<FormState>(initialForm);

  useMemo(() => {
    if (isEditMode && userData?.data) {
      const u = userData.data;
      setForm({
        name: u.name ?? "",
        email: u.email ?? "",
        password: "",
        phone: u.phone ?? "",
        country: u.country ?? "",
        country_code: u.country_code ?? "",
        note: u.note ?? "",
        status: u.status,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const set = (key: keyof FormState, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const isValid = form.name.trim() && form.email.trim() && (isEditMode || form.password.trim());

  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      if (isEditMode && id) {
        const payload: UpdateUserPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          country: form.country.trim() || undefined,
          country_code: form.country_code.trim() || undefined,
          note: form.note.trim() || undefined,
          status: form.status,
        };
        await updateUser({ id, data: payload }).unwrap();
        toast.success("User updated successfully");
      } else {
        const payload: CreateUserPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim() || undefined,
          country: form.country.trim() || undefined,
          country_code: form.country_code.trim() || undefined,
          note: form.note.trim() || undefined,
        };
        await createUser(payload).unwrap();
        toast.success("User created successfully");
      }
      setTimeout(() => router.push("/manage_users"), 800);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gray-200 dark:border-zinc-700 border-t-(--text-green-primary) rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-gray-200 dark:border-(--card-border-color) hover:bg-gray-50 dark:hover:bg-(--dark-sidebar)">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-(--text-green-primary)">{isEditMode ? "Edit User" : "Add New User"}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{isEditMode ? "Update user information and permissions" : "Create a new user account"}</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white dark:bg-(--card-color) rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) shadow-sm overflow-hidden">
          <div className="sm:px-6 px-4 py-4 border-b border-gray-100 dark:border-(--card-border-color) flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-(--primary)/10 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Information</h2>
          </div>
          <div className="sm:p-6 p-4 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 flex flex-col">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" className="h-10 bg-(--input-color) rounded-lg p-3 dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-zinc-700" />
            </div>
            <div className="space-y-1.5 flex flex-col">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="john@example.com" className="h-10 bg-(--input-color) rounded-lg p-3 dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-zinc-700" />
            </div>
            {!isEditMode && (
              <div className="space-y-1.5 flex flex-col md:col-span-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min. 8 characters" className="h-10 bg-(--input-color) rounded-lg p-3 dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-zinc-700" />
              </div>
            )}
            <div className="space-y-1.5 flex flex-col">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</Label>
              <CountrySelect
                value={form.country}
                onSelect={(country: Country) => {
                  set("country", country.name);
                  set("country_code", country.dial_code);
                }}
              />
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-3">
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Code</Label>
                <Input value={form.country_code} disabled placeholder="+1" className="h-10 bg-(--input-color) rounded-lg p-3 dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-zinc-700 opacity-70 cursor-not-allowed" />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</Label>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="1234567890" className="h-10 bg-(--input-color) rounded-lg p-3 dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-zinc-700" />
              </div>
            </div>
            <div className="space-y-1.5 flex flex-col md:col-span-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Note</Label>
              <Textarea value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Internal notes about this user..." rows={3} className="bg-(--input-color) border rounded-lg p-3 dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-zinc-700 resize-none" />
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white dark:bg-(--card-color) rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) shadow-sm overflow-hidden">
          <div className="sm:px-6 px-4 py-4 border-b border-gray-100 dark:border-(--card-border-color)">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Account Settings</h2>
          </div>
          <div className="sm:p-6 p-4 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Account Active</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Allow this user to log in</p>
              </div>
              <Switch checked={form.status} onCheckedChange={(v) => set("status", v)} className="data-[state=checked]:bg-(--text-green-primary)" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="px-6 rounded-lg border-(--input-border-color) dark:border-(--card-border-color) dark:bg-(--card-color) dark:text-gray-200">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !isValid} className="px-6 rounded-lg bg-(--text-green-primary) hover:bg-(--text-green-primary)/90 text-white gap-2">
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update User" : "Create User"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
