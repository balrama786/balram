"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapPin, Navigation, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { toast } from "sonner";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (location: Location) => void;
}

// Map events component to handle clicks
const MapEvents = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to handle map center updates
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const LocationPickerModal = ({ isOpen, onClose, onSend }: LocationPickerModalProps) => {
  const [position, setPosition] = useState<[number, number]>([19.076, 72.8777]); // Default Mumbai
  const [address, setAddress] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Fetch address from coordinates
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, { headers: { "User-Agent": "Wapi-Chat-App" } });
      const data = await response.json();
      setAddress(data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } catch (error) {
      console.error("Failed to fetch address:", error);
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setIsReverseGeocoding(false);
    }
  }, []);

  // Handle location selection from map
  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setPosition([lat, lng]);
      fetchAddress(lat, lng);
    },
    [fetchAddress]
  );

  // Handle search
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`, { headers: { "User-Agent": "Wapi-Chat-App" } });
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setPosition([lat, lng]);
        setAddress(data[0].display_name);
      } else {
        toast.error("Location not found");
      }
    } catch (error) {
      toast.error(`Search failed ${error}`);
    } finally {
      setIsSearching(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        fetchAddress(latitude, longitude);
        setIsLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Initial location fetch
  useEffect(() => {
    if (isOpen) {
      getCurrentLocation();
    }
  }, [isOpen]);

  const handleSendLocation = () => {
    onSend({
      latitude: position[0],
      longitude: position[1],
      address: address,
    });
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] md:w-full p-0! gap-0 overflow-hidden bg-white dark:bg-(--card-color) border-none shadow-2xl rounded-lg max-h-[90vh] sm:max-h-[85vh] flex flex-col">
        <DialogHeader className="p-4 sm:p-5 pb-0 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold text-primary">
            <MapPin className="text-primary w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="flex-1 text-left">Share Location</span>
            <Button onClick={handleClose} className="p-1 bg-gray-100 hover:bg-slate-200 dark:bg-transparent dark:hover:bg-(--table-hover) rounded-lg transition-colors shrink-0">
              <X className="w-5 h-5 text-slate-500 dark:text-gray-400" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-2 sm:pt-4 space-y-3 sm:space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          <form onSubmit={handleSearch} className="relative group">
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for a place or address..." className="pl-10 sm:pl-12 pr-10 h-10 sm:h-12 text-sm sm:text-base bg-(--input-color) dark:bg-(--page-body-bg) border-slate-100 dark:border-(--card-border-color) rounded-lg focus-visible:ring-primary transition-all font-medium" />
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-emerald-500 transition-colors" />
            {isSearching && <Loader2 className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />}
          </form>

          {/* Map Container */}
          <div className="relative h-75 sm:h-87.5 md:h-100 w-full rounded-lg overflow-hidden border border-slate-100 dark:border-(--card-border-color) shadow-inner group">
            <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ChangeView center={position} />
              <MapEvents onLocationSelect={handleLocationSelect} />
              <Marker position={position} icon={customIcon} />
            </MapContainer>

            {/* Float Controls */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-1000 flex flex-col gap-2">
              <Button type="button" title="live location" size="icon" onClick={getCurrentLocation} className="h-9 w-9 sm:h-10 sm:w-10 text-slate-500 hover:text-white rounded-lg shadow-lg transition-all active:scale-95 bg-white dark:bg-(--card-color) dark:text-neutral-300" disabled={isLocating}>
                {isLocating ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />}
              </Button>
            </div>
          </div>

          {/* Location Info */}
          <div className="p-3 sm:p-4 bg-slate-50 dark:bg-(--table-hover) rounded-lg border border-slate-100 dark:border-(--card-border-color) transition-all">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="mt-0.5 sm:mt-1 p-1.5 sm:p-2 bg-emerald-100 dark:bg-(--table-hover) rounded-lg shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary dark:text-emerald-400" />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Location</p>
                {isReverseGeocoding ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span className="text-xs sm:text-sm">Fetching address...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-neutral-200 leading-relaxed wrap-break-word">{address || "Select a location on the map"}</p>
                    <p className="text-xs font-mono text-slate-400 break-all">
                      {position[0].toFixed(6)}, {position[1].toFixed(6)}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            <Button variant="ghost" onClick={onClose} className="flex-1 h-10 sm:h-12 text-sm sm:text-base rounded-lg px-3 sm:px-4 py-4 sm:py-5 font-bold dark:hover:bg-(--table-hover) hover:bg-slate-100 transition-all">
              Cancel
            </Button>
            <Button onClick={handleSendLocation} disabled={!position || isSearching || isReverseGeocoding} className="flex-1 sm:flex-2 h-10 sm:h-12 text-sm sm:text-base rounded-lg bg-primary text-white font-bold shadow-md px-3 sm:px-4 py-4 sm:py-5 shadow-emerald-500/20 flex items-center justify-center gap-2">
              <SendIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="hidden xs:inline">Share Location</span>
              <span className="xs:hidden">Send</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SendIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export default LocationPickerModal;
