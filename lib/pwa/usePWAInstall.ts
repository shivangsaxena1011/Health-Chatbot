'use client';

import { useState, useEffect, useCallback } from 'react';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    setIsInstalled(isStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Check if dismissed recently (within 24 hours)
    const dismissedAt = localStorage.getItem('swasth_pwa_banner_dismissed');
    if (dismissedAt) {
      const timeSince = Date.now() - parseInt(dismissedAt, 10);
      if (timeSince < 24 * 60 * 60 * 1000) {
        setBannerDismissed(true);
      } else {
        setBannerDismissed(false);
      }
    } else {
      setBannerDismissed(false);
    }

    // Capture standard PWA install event for Chrome/Edge/Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setBannerDismissed(false);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setBannerDismissed(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (isInstalled) {
      alert('Swasth AI is already installed on your device!');
      return;
    }

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          setBannerDismissed(true);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
      return;
    }

    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // Fallback for browsers with menu-based install (e.g. Chrome desktop or Firefox)
    alert(
      'To install Swasth AI:\n• On Chrome/Edge: Click the Install icon in the browser address bar.\n• On Mobile: Tap the browser menu (⋮ or Share) and select "Install app" or "Add to Home Screen".'
    );
  }, [deferredPrompt, isIOS, isInstalled]);

  const dismissBanner = useCallback(() => {
    setBannerDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('swasth_pwa_banner_dismissed', Date.now().toString());
    }
  }, []);

  return {
    isInstallable: !isInstalled && (!!deferredPrompt || isIOS),
    isInstalled,
    isIOS,
    showIOSModal,
    setShowIOSModal,
    bannerVisible: !isInstalled && !bannerDismissed,
    promptInstall,
    dismissBanner,
  };
}
