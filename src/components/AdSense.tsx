"use client";

import { useEffect, useRef } from "react";

interface AdSenseProps {
  adSlot: string;
  adClient?: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  fullWidthResponsive?: boolean;
  adTest?: boolean;
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
  adClient = "ca-pub-9204160176455905",
  adFormat = "auto",
  fullWidthResponsive = true,
  adTest = false,
  className = "",
  style = { display: "block", minWidth: "100%", width: "100%" },
}: AdSenseProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Prevent double push
    if (pushed.current) return;

    const ins = insRef.current;
    if (!ins) return;

    // Check if the script is loaded
    if (typeof window !== "undefined" && ins) {
      // Check if already processed by AdSense
      if (ins.getAttribute("data-adsbygoogle-status") === "done") return;

      try {
        pushed.current = true;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense push error:", err);
        pushed.current = false;
      }
    }
  }, []);

  return (
    <div className={`adsense-container w-full flex justify-center overflow-hidden my-4 ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
        data-adtest={adTest ? "on" : "off"}
      />
    </div>
  );
}