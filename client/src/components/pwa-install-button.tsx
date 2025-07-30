import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInStandaloneMode = isStandalone || (window.navigator as any).standalone;
    setIsInstalled(isInStandaloneMode);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: Install prompt available');
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(installEvent);
      setCanInstall(true);

      // Show install banner after a delay
      setTimeout(() => {
        showInstallBanner();
      }, 3000);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log('PWA: App installed');
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
      toast({
        title: "App installed successfully!",
        description: "AppKickstart is now available on your home screen.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA: User accepted install');
        setCanInstall(false);
        setDeferredPrompt(null);
      } else {
        console.log('PWA: User dismissed install');
      }
    } catch (error) {
      console.error('PWA: Install failed', error);
      toast({
        title: "Installation failed",
        description: "Unable to install the app. Please try again.",
        variant: "destructive",
      });
    }
  };

  const showInstallBanner = () => {
    // Only show if not already shown and element doesn't exist
    if (document.getElementById('pwa-install-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 z-50 shadow-lg';
    banner.style.cssText = 'animation: slideInFromTop 0.5s ease-out';
    banner.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; max-width: 1280px; margin: 0 auto; padding: 0 1rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <svg style="width: 1.5rem; height: 1.5rem;" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
          <span style="font-size: 0.875rem; font-weight: 500;">Install AppKickstart for quick access and offline use!</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button id="pwa-banner-install-btn" style="background: white; color: #ea580c; padding: 0.25rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s;">
            Install
          </button>
          <button id="pwa-banner-dismiss-btn" style="color: white; background: none; border: none; cursor: pointer; padding: 0.25rem; transition: color 0.2s;">
            <svg style="width: 1.25rem; height: 1.25rem;" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInFromTop {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(banner);

    // Add event listeners
    document.getElementById('pwa-banner-install-btn')?.addEventListener('click', handleInstall);
    document.getElementById('pwa-banner-dismiss-btn')?.addEventListener('click', () => {
      banner.remove();
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (document.getElementById('pwa-install-banner')) {
        banner.remove();
      }
    }, 10000);
  };

  // Don't render anything if installed or not available
  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleInstall}
      className="flex items-center space-x-2 border-orange-200 hover:bg-orange-50"
    >
      <Download className="h-4 w-4" />
      <span>Install App</span>
    </Button>
  );
}