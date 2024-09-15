import React from "react";
import useArticle from "@/hooks/useArticle";
import clsx from "clsx";

const ProductionMonth = () => {
  const { value, handleChange } =
    useArticle<string>("year");

  return (
    <input
      className={clsx(
        "bg-white h-[44px] pl-[15px] mt-[1px] pr-[15px]",
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
