"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { MANILA_TIMEZONE } from "@/lib/time";

export default function LiveClock() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    // Initial drift-sync with Asia/Manila, then 1-second interval
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        timeZone: MANILA_TIMEZONE,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-300 font-medium">
      <Clock className="w-4 h-4 text-gray-400" />
      <span>{timeStr || "5:35 PM"}</span>
    </div>
  );
}
