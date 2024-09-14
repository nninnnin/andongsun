import { useEffect, useState } from "react";

const useBreakpoint = () => {
  const [isMobile, setIsMobile] = useState<
    null | boolean
  >(null);

  useEffect(() => {
    const checkAndSetIsMobile = () => {
      setIsMobile(window.innerWidth < 480);
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
