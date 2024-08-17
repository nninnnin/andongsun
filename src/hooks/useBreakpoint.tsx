import { useEffect, useState } from "react";

const useBreakpoint = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkAndSetIsMobile = () => {
      setIsMobile(window.innerWidth < 440);
    };

    checkAndSetIsMobile();

    window.addEventListener(
      "resize",
      checkAndSetIsMobile
    );
  }, []);

  return {
    isMobile,
  };
};

export default useBreakpoint;
