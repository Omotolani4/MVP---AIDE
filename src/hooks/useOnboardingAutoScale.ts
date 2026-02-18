import { useEffect, useState } from "react";

/**
 * Auto-scales onboarding pages (Quiz 1, Quiz 2, Submission)
 * Keeps content smaller and fully visible on all desktop heights
 */
export function useOnboardingAutoScale() {
  const [scale, setScale] = useState(0.96); // baseline smaller

  useEffect(() => {
    const calculateScale = () => {
      const h = window.innerHeight;

      // Smaller than previous versions on purpose
      if (h < 700) return setScale(0.84);
      if (h < 760) return setScale(0.88);
      if (h < 820) return setScale(0.90);
      if (h < 900) return setScale(0.93);

      setScale(0.96); // default desktop size
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  return scale;
}
