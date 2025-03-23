import React from "react";
import clsx from "clsx";

const Container = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={clsx("bg-white", "flex flex-col")}>
      {children}
    </div>
  );
};

export default Container;
