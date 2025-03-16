import React from "react";
import clsx from "clsx";

const ConfirmButton = ({
  handleClick,
  inputValidated = false,
}: {
  handleClick: () => void;
  inputValidated: boolean;
}) => {
  return (
    <button
      className={clsx(
        "bg-black text-white p-[4px]",
        "border-[1px] border-white",
        "disabled:bg-gray-300",
        "disabled:pointer-events-none",
        "select-none",
        "text-[0.8em]"
      )}
      onClick={handleClick}
      disabled={!inputValidated}
    >
      확인
    </button>
  );
};

export default ConfirmButton;
