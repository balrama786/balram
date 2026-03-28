"use client";

import { useState, useEffect, useCallback } from "react";

const useInternetConnection = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const retry = useCallback(async () => {
    setIsChecking(true);
    // Simulate a small delay for checking
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsOnline(navigator.onLine);
    setIsChecking(false);
  }, []);

  return { isOnline, isChecking, retry };
};

export default useInternetConnection;
