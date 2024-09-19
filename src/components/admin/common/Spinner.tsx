import clsx from "clsx";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const Spinner = ({
  contents,
  onMount,
}: {
  contents: string;
  onMount: () => void;
}) => {
  useEffect(() => {
    onMount();
  }, []);

  return createPortal(
    <div className="fixed top-0 left-0 z-[9999] w-screen h-[calc(100dvh-[100px])] bg-[#333333] bg-opacity-50">
      <div
        className={clsx(
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "bg-themeBlue border-[1.5px] border-white",
          "py-[10px] px-[16.5px]",
          "text-white text-[16px] font-bold leading-[150%]"
        )}
      >
        {contents}
      </div>
    </div>,
    document.body
  );
};

export default Spinner;
