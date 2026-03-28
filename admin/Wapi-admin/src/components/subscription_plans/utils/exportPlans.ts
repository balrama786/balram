import { Subscription } from "@/src/types/store";

export const exportSubscriptionsToCSV = (
  subscriptions: Subscription[],
  filename: string = `subscriptions_${new Date().toISOString().split("T")[0]}.csv`
) => {
  const headers = [
    "User Name",
    "User Email",
    "Plan Name",
    "Amount",
    "Billing Cycle",
    "Status",
    "Gateway",
    "Transaction ID",
    "Start Date",
    "End Date",
    "Created At",
  ];

  const csvContent = [
    headers.join(","),
    ...subscriptions.map((sub) =>
      [
        `"${(sub.user?.name || "N/A").replace(/"/g, '""')}"`,
        `"${(sub.user?.email || "N/A").replace(/"/g, '""')}"`,
        `"${(sub.plan?.name || "N/A").replace(/"/g, '""')}"`,
        sub.amount_paid || 0,
        `"${sub.plan?.billing_cycle || "N/A"}"`,
        sub.status || "N/A",
        `"${sub.payment_gateway || "N/A"}"`,
        `"${sub.transaction_id || sub.payment_id || "N/A"}"`,
        sub.current_period_start ? new Date(sub.current_period_start).toLocaleDateString() : "N/A",
        sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : "N/A",
        sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "N/A",
      ].join(",")
    ),
  ].join("\n");

  // Download CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
