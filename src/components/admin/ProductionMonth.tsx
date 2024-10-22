import React from "react";
import useArticle from "@/hooks/useArticle";
import clsx from "clsx";

const ProductionMonth = () => {
  const { value, handleChange } =
    useArticle<string>("year");

  return (
    <input
      className={clsx(
        "w-[150px] flex-1",
        "bg-white h-[44px] pl-[15px] pr-[15px]",
        "border-y-[1px] border-r-[1px] border-themeBlue",
        "font-bold",
        "cursor-pointer",
        "outline-none"
      )}
      type="month"
      onChange={(e) => {
        handleChange(e.target.value);
      }}
      value={value}
    />
  );
};

export default ProductionMonth;
