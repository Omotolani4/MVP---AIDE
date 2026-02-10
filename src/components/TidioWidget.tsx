import { useEffect, useRef } from "react";

declare global {
  interface Window {
    tidioChatApi?: {
      open: () => void;
      hide: () => void;
      show: () => void;
      on: (event: string, callback: () => void) => void;
    };
  }
}

const TIDIO_PUBLIC_KEY = "mssrvvupqgrdzi78bgqqx6hqrsnncijw";
let tidioLoadPromise: Promise<void> | null = null;

const loadTidioScript = (): Promise<void> => {
  if (tidioLoadPromise) return tidioLoadPromise;

  tidioLoadPromise = new Promise((resolve) => {
    // Check if script already exists
    if (document.getElementById("tidio-script")) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = "tidio-script";
    script.src = `//code.tidio.co/${TIDIO_PUBLIC_KEY}.js`;
    script.async = true;

    script.onload = () => {
      // Hide the default Tidio bubble on load
      const onTidioChatApiReady = () => {
        if (window.tidioChatApi) {
          window.tidioChatApi.hide();
        }
        resolve();
      };

      if (window.tidioChatApi) {
        window.tidioChatApi.on("ready", onTidioChatApiReady);
        onTidioChatApiReady();
      } else {
        document.addEventListener("tidioChat-ready", onTidioChatApiReady);
      }
    };

    document.body.appendChild(script);
  });

  return tidioLoadPromise;
};

export const TidioWidget = () => {
  return null;
};

export const openTidioChat = async () => {
  await loadTidioScript();
  if (window.tidioChatApi) {
    window.tidioChatApi.show();
    window.tidioChatApi.open();
  }
};

// Chat button component
export const TidioChatButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      loadTidioScript();
      if (tooltipRef.current) {
        tooltipRef.current.classList.remove("opacity-0", "pointer-events-none");
        tooltipRef.current.classList.add("opacity-100");
      }
    };

    const handleMouseLeave = () => {
      if (tooltipRef.current) {
        tooltipRef.current.classList.add("opacity-0", "pointer-events-none");
        tooltipRef.current.classList.remove("opacity-100");
      }
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="bg-foreground text-background px-3 py-1 rounded-md text-sm font-medium opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap"
      >
        Chat with us
      </div>

      {/* Chat Button */}
      <button
        ref={buttonRef}
        onClick={openTidioChat}
        className="group relative w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center"
        aria-label="Open chat"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      </button>
    </div>
  );
};
