"use client";

import React from "react";
import { TimePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import { Clock } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface TimeInputProps {
  value: string; // "HH:MM"
  onChange: (val: string) => void;
  placeholder?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, placeholder = "00:00" }) => {
  const format = "HH:mm";

  // Convert string "HH:mm" to dayjs object for Ant Design TimePicker
  const dayjsValue = value ? dayjs(value, format) : null;

  const handleChange = (time: dayjs.Dayjs | null) => {
    if (time) {
      onChange(time.format(format));
    } else {
      onChange("00:00");
    }
  };

  return (
    <div className="relative ant-time-picker-custom">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#16a34a",
            borderRadius: 8,
          },
          components: {
            DatePicker: {
              cellActiveWithRangeBg: "rgba(22, 163, 74, 0.1)",
            },
          },
        }}
      >
        <TimePicker value={dayjsValue} format={format} placeholder={placeholder} onChange={handleChange} allowClear={false} suffixIcon={<Clock size={14} className="text-slate-400" />} getPopupContainer={(trigger) => trigger.parentElement || document.body} className={cn("h-10 px-3 min-w-30 text-sm font-mono font-medium transition-all text-slate-700 dark:text-white!", "bg-white border  dark:bg-(--page-body-bg)! dark:border-(--card-border-color)!", "hover:border-primary focus:border-primary focus:shadow-[0_0_0_2px_rgba(22,163,74,0.1)] cursor-pointer")} popupClassName="dark-time-picker-dropdown" inputReadOnly showNow={false} needConfirm={false} changeOnScroll={true} />
      </ConfigProvider>
    </div>
  );
};

export default TimeInput;
