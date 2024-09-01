import useArticle from "@/hooks/useArticle";
import React from "react";

const ProductionMonth = () => {
  const { value, handleChange } =
    useArticle<string>("year");

  return (
    <div className="flex items-center space-x-[12px] bg-white selector">
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
