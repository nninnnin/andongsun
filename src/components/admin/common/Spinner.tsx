import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";

const Spinner = ({
  contents,
}: {
  contents: string;
}) => {
  return createPortal(
    <div className="fixed top-0 left-0 z-[9999] w-screen h-[calc(100dvh-[100px])] bg-black bg-opacity-50">
      <div
        className={clsx(
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "h-[44px]",
          "bg-themeBlue border-[1.5px] border-white",
          "p-5"
        )}
      >
        {contents}
      </div>
    </div>,
    document.body
  );
};

export default Spinner;
