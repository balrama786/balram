"use client";

import React from "react";
import { ChatMessage } from "@/src/types/components/chat";
import { MapPin } from "lucide-react";
import BaseMessage from "./BaseMessage";

interface LocationMessageProps {
  message: ChatMessage;
}

const LocationMessage: React.FC<LocationMessageProps> = ({ message }) => {
  // Extract location from content if it's a JSON string, or use direct fields if available
  let locationData = { latitude: 0, longitude: 0, address: "" };

  try {
    if (message.content) {
      const parsed = JSON.parse(message.content);
      locationData = {
        latitude: parsed.latitude || 0,
        longitude: parsed.longitude || 0,
        address: parsed.address || message.content,
      };
    }
  } catch {
    locationData.address = message.content || "Location shared";
  }

  const mapUrl = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;

  return (
    <BaseMessage message={message}>
      <div className="flex flex-col gap-2 min-w-50 max-w-70">
        {/* Map Preview Placeholder/Static Image */}
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="relative group overflow-hidden rounded-lg border border-slate-100 dark:border-none transition-all hover:ring-2 hover:ring-emerald-500/20">
          <div className="h-32 bg-slate-100 dark:bg-(--card-color) flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=${locationData.latitude},${locationData.longitude}&zoom=14&size=400x400&markers=color:red%7C${locationData.latitude},${locationData.longitude}&key=YOUR_API_KEY')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500" />
            <div className="z-10 bg-white/90 dark:bg-(--dark-body) p-3 rounded-lg shadow-xl flex items-center gap-2 border border-slate-100 dark:border-none group-hover:scale-110 transition-transform">
              <MapPin className="text-primary w-5 h-5 animate-bounce" />
              <span className="text-xs font-bold text-slate-700 dark:text-neutral-200">View on Map</span>
            </div>
          </div>
        </a>

        {/* Location Text */}
        <div className="px-1 py-0.5">
          <p className="text-[13px] font-medium text-slate-700 dark:text-neutral-200 leading-snug line-clamp-2">{locationData.address}</p>
          <p className="text-[10px] font-mono text-slate-500 dark:text-gray-400 mt-1">
            {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
          </p>
        </div>
      </div>
    </BaseMessage>
  );
};

export default LocationMessage;
