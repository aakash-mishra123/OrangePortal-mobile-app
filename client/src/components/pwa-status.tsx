import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function PWAStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isStandalone, setIsStandalone] = useState(false);
  const [swStatus, setSWStatus] = useState<'loading' | 'active' | 'error'>('loading');

  useEffect(() => {
    // Check if running as installed PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(() => setSWStatus('active'))
        .catch(() => setSWStatus('error'));
    } else {
      setSWStatus('error');
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isStandalone) return null; // Only show when running as PWA

  return (
    <div className="fixed bottom-4 left-4 z-50 flex space-x-2">
      <Badge variant={isOnline ? "default" : "destructive"}>
        {isOnline ? "🟢 Online" : "🔴 Offline"}
      </Badge>
      
      <Badge variant={swStatus === 'active' ? "default" : "secondary"}>
        {swStatus === 'active' ? "🔧 PWA Active" : "⚠️ PWA Loading"}
      </Badge>
    </div>
  );
}