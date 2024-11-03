import clsx from "clsx";
import React from "react";

const Alert = ({
  show,
  desc,
  handleConfirm,
  handleClose,
}: {
  show: boolean;
  desc: string;
  handleConfirm: () => void;
  handleClose: () => void;
}) => {
  if (!show) return <></>;

  return (
    <div
      className={clsx(
        "w-screen h-screen bg-[#333333] bg-opacity-50",
        "fixed top-0 left-0 z-[9999]",
        "p-10"
      )}
    >
      <div
        className={clsx(
          "min-w-[180px]",
          "bg-white text-white",
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "flex flex-col gap-[1px]",
          "border-[1.5px] border-white"
        )}
      >
        <p className="flex-1 px-[15px] py-[10px] bg-themeBlue font-bold text-center">
          {desc}
        </p>

        <div className="flex flex-1 w-full">
          <Alert.Button handleClick={handleConfirm}>
            확인
          </Alert.Button>

          <Alert.Button handleClick={handleClose}>
            취소
          </Alert.Button>
        </div>
      </div>
    </div>
  );
};

Alert.Button = ({
  children,
  handleClick,
}: {
  children: React.ReactNode;
  handleClick: () => void;
}) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        "flex-1 p-3 bg-themeBlue",
        "cursor-pointer",
        "border-white border-r-[2px] last:border-r-0"
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default Alert;
