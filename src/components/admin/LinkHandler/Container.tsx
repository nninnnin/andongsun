import React from "react";
import clsx from "clsx";

const Container = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "bg-themeBlue",
        "flex flex-col",
        "p-[80px]"
      )}
    >
      {children}
    </div>
  );
};

export default Container;
