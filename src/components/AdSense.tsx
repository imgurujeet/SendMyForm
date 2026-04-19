"use client";

import { useEffect, useRef } from "react";

interface AdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  style = { display: "block", minWidth: "300px", width: "100%" },
}: AdSenseProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;

    if (!document.querySelector('script[src*="pagead/js/adsbygoogle.js"]')) {
      const script = document.createElement("script");
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9204160176455905";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    const ins = insRef.current;
    if (!ins) return;

    if (
      ins.getAttribute("data-ad-status") === "filled" ||
      ins.getAttribute("data-ad-status") === "unfilled"
    ) return;

    const container = ins.parentElement;
    if (container && container.offsetWidth === 0) return;

    try {
      pushed.current = true;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense push error:", err);
      pushed.current = false;
    }
  }, []);

  return (
    <div className={`adsense-container flex justify-center overflow-hidden ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-9204160176455905"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}