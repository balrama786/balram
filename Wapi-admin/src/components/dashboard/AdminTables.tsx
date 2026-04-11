/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/elements/ui/card";
import { Badge } from "@/src/elements/ui/badge";
import DataTable from "@/src/shared/DataTable";
import { ColumnDef } from "@/src/types/shared";
import { format } from "date-fns";
import { Users, CreditCard, XCircle, MessageSquare, ArrowUpRight, Globe } from "lucide-react";

// Types from our API slice
import { AdminDashboardData } from "@/src/redux/api/adminDashboardApi";
import { useAppSelector } from "@/src/redux/hooks";

type DashboardTableData = AdminDashboardData["tables"];

export const NewUsersTable = ({ data }: { data: DashboardTableData["newUsers"] }) => {
  const columns: ColumnDef<any>[] = [
    {
      header: "Member Profile",
      className: "[@media(max-width:1480px)]:min-w-[240px]",
      cell: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-white/10 shrink-0 capitalize">{row.name.charAt(0)}</div>
          <div className="flex flex-col min-w-0">
            <span className="font-black text-[12px] text-slate-800 dark:text-white text-xs truncate">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-bold truncate">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Verification",
      className: "[@media(max-width:1480px)]:min-w-[160px]",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Globe size={12} className="text-slate-300" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 tracking-tight">{row.phone}</span>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{row.country || "GLOBAL"}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Access Level",
      className: "[@media(max-width:1480px)]:min-w-[153px]",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border-0 ring-1 ring-inset ${row.planName === "No Plan" ? "bg-slate-500/10 text-slate-500 ring-slate-500/20" : "bg-primary/10 text-primary ring-primary/30"}`}>
            {row.planName}
          </Badge>
          <ArrowUpRight size={10} className="text-slate-300 group-hover:text-primary transition-colors" />
        </div>
      ),
    },
    {
      header: "Joined",
      className: "[@media(max-width:1480px)]:min-w-[145px]",
      cell: (row) => <span className="text-[10px] font-black text-slate-400 tabular-nums bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md border border-slate-200/50 dark:border-white/5">{format(new Date(row.created_at), "MMM dd, yyyy")}</span>,
    },
  ];

  return (
    <Card className="border border-(--input-border-color) h-full bg-white dark:border-(--card-border-color) dark:bg-(--card-color) backdrop-blur-xl shadow-sm overflow-hidden group">
      <CardHeader className="pb-4 border-b border-(--input-border-color) dark:border-(--card-border-color) bg-(--input-color) dark:bg-(--card-color)">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:rotate-6 transition-transform">
            <Users size={18} className="text-primary" />
          </div>
          <div>
            <CardTitle className="text-[19px]  font-medium tracking-tight text-slate-800 dark:text-white">New Users</CardTitle>
            <CardDescription className="text-[12px] font-bold dark:text-gray-400 opacity-60">Verified system registrations</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable data={data.slice(0, 5)} columns={columns} emptyMessage="No new users found." itemsPerPage={5} pagination={false} tableClassName="border-none! shadow-none!" />
      </CardContent>
    </Card>
  );
};

export const SubscriptionsTable = ({ data, title, type }: { data: DashboardTableData["newSubscriptions"]; title: string; type: "active" | "cancelled" }) => {
  const settings = useAppSelector((state) => state.settings.data);
  const defaultSymbol = settings?.default_currency?.symbol || "$";

  const columns: ColumnDef<any>[] = [
    {
      header: "Account",
      className: "[@media(max-width:1690)]:min-w-[170px]",
      cell: (row) => (
        <div className="flex flex-col min-w-0 py-1">
          <span className="font-black text-[12px] text-slate-800 dark:text-white text-xs truncate">{row.userName}</span>
          <span className="text-[10px] text-slate-400 font-bold truncate opacity-70">{row.userEmail}</span>
        </div>
      ),
    },
    {
      header: "Service Details",
      className: "[@media(max-width:1690)]:min-w-[155px]",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{row.planName}</span>
          <span className="text-[11px] text-primary font-black tabular-nums tracking-tighter">
            {defaultSymbol} {row.amount_paid.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      className: "[@media(max-width:762px)]:min-w-[110px]",
      cell: (row) => <Badge className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border-0 hover:bg-(--light-primary) hover:text-primary dark:hover:bg-(--card-color) ring-1 ring-inset ${row.status === "active" ? "bg-emerald-500/10 text-primary ring-emerald-500/30" : "bg-red-500/10 dark:hover:border-(--card-border-color) dark:hover:text-red-500 text-red-500 ring-red-500/30"}`}>{row.status}</Badge>,
    },
    {
      header: "Payment",
      className: "[@media(max-width:762px)]:min-w-[130px]",
      cell: (row) => (
        <Badge variant="outline" className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border-0 ring-1 ring-inset ${row.payment_status === "paid" ? "bg-primayry/10 text-primary ring-primary/30" : "bg-primary/10 text-primary ring-primary/30"}`}>
          {row.payment_status}
        </Badge>
      ),
    },
    {
      header: "Expiry/Renewal",
      className: "[@media(max-width:1690px)]:min-w-[153px]",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <span className="text-[12px] font-black text-slate-500 dark:text-gray-400 tabular-nums uppercase">{format(new Date(row.current_period_end), "MMM dd")}</span>
          <span className="text-[12px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest">{format(new Date(row.current_period_end), "yyyy")}</span>
        </div>
      ),
    },
  ];

  const themeColor = type === "active" ? "emerald" : "rose";
  const Icon = type === "active" ? CreditCard : XCircle;

  return (
    <Card className={`border border-(--input-border-color) dark:border-(--card-border-color) bg-white/70 dark:bg-(--card-color)  overflow-hidden h-full group`}>
      <CardHeader className={`pb-4 sm:p-6 p-4 border-b border-(--input-border-color) dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color) shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 bg-${themeColor}-500/10 dark:bg-${themeColor}-500/20 rounded-lg group-hover:scale-110 transition-transform`}>
            <Icon size={18} className={`text-${themeColor}-500`} />
          </div>
          <div>
            <CardTitle className="sm:text-[19px] text-[17px] font-medium tracking-tight text-slate-800 dark:text-white">{title}</CardTitle>
            <CardDescription className="text-[12px] font-bold dark:text-gray-400 opacity-60">{type === "active" ? "Real-time revenue channels" : "Deflected customer cycles"}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable data={data.slice(0, 5)} columns={columns} emptyMessage={`No ${type} subscriptions found.`} itemsPerPage={5} pagination={false} tableClassName="border-none! shadow-none!" />
      </CardContent>
    </Card>
  );
};

export const InquiriesTable = ({ data }: { data: DashboardTableData["recentInquiries"] }) => {
  const columns: ColumnDef<any>[] = [
    {
      header: "Petitioner",
      className: "[@media(max-width:1320px)]:min-w-[180px]",
      cell: (row) => (
        <div className="flex flex-col min-w-10 max-w-28 py-1">
          <span className="font-black text-[12px] text-slate-800 dark:text-white text-xs truncate">{row.name}</span>
          <span className="text-[9px] text-slate-400 font-bold truncate opacity-80">{row.email}</span>
        </div>
      ),
    },
    {
      header: "Abstract",
      className: "[@media(max-width:1320px)]:min-w-[175px]",
      cell: (row) => (
        <div className="flex flex-col max-w-xs py-1">
          <span className="text-[12px] font-black text-slate-700 dark:text-slate-200 truncate">{row.subject}</span>
          <span className="text-[10px] text-slate-400 truncate italic font-medium opacity-60 tracking-tight">{row.message}</span>
        </div>
      ),
    },
    {
      header: "Arrival",
      className: "[@media(max-width:1320px)]:min-w-[155px]",
      cell: (row) => (
        <div className="flex items-center">
          <span className="text-[10px] font-black text-slate-500 bg-slate-100 dark:bg-transparent px-2 py-1 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) dark:text-primary shadow-sm">{format(new Date(row.created_at), "MMM dd")}</span>
        </div>
      ),
    },
  ];

  return (
    <Card className="border border-(--input-border-color) dark:border-(--card-border-color) bg-white/70 dark:bg-(--card-color) overflow-hidden h-full group">
      <CardHeader className="pb-4 sm:p-6 p-4 border-b border-(--input-border-color) dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color) shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:rotate-6 transition-transform">
            <MessageSquare size={18} className="text-primary" />
          </div>
          <div>
            <CardTitle className="text-[19px] font-medium tracking-tight text-slate-800 dark:text-white">Recent Inquiries</CardTitle>
            <CardDescription className="text-[12px] font-bold dark:text-gray-400 opacity-60">High-priority support requests</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable data={data.slice(0, 5)} columns={columns} emptyMessage="No recent inquiries found." itemsPerPage={5} pagination={false} tableClassName="border-none! shadow-none!" />
      </CardContent>
    </Card>
  );
};
