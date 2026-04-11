/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportFormat = "csv" | "excel" | "pdf";

export interface ExportColumn {
  header: string;
  key: string; // supports nested paths like 'user.email'
}

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export const exportData = ({
  data,
  columns,
  filename = "export",
  format,
}: {
  data: any[];
  columns: ExportColumn[];
  filename?: string;
  format: ExportFormat;
}) => {
  const headers = columns.map((col) => col.header);
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = getNestedValue(item, col.key);
      return value === null || value === undefined ? "" : String(value);
    })
  );

  if (format === "csv") {
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (format === "excel") {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => {
        const row: any = {};
        columns.forEach((col) => {
          row[col.header] = getNestedValue(item, col.key);
        });
        return row;
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } else if (format === "pdf") {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [headers],
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [52, 73, 94] },
    });
    doc.save(`${filename}.pdf`);
  }
};
