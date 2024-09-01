import useArticle from "@/hooks/useArticle";
import React from "react";

const ProductionMonth = () => {
  const { value, handleChange } =
    useArticle<string>("year");

  return (
    <div className="flex h-[40px] items-center space-x-[12px] bg-white">
      <input
        className="bg-transparent"
        type="month"
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        value={value}
      />
    </div>
  );
};

export default ProductionMonth;
