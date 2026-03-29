'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const TawkChat = () => {
  const scriptUrl = 'https://embed.tawk.to/69c8b7fd0c50e01c367c3a4e/1jks0tdq6';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('tawk-chat-script')) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.id = 'tawk-chat-script';
    script.async = true;
    script.src = scriptUrl;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.body.appendChild(script);
    }

    return () => {
      const existing = document.getElementById('tawk-chat-script');
      if (existing) {
        existing.remove();
      }
    };
  }, [scriptUrl]);

  return null;
};

export default TawkChat;
