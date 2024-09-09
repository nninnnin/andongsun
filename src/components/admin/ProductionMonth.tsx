import React from "react";
import useArticle from "@/hooks/useArticle";

const ProductionMonth = () => {
  const { value, handleChange } =
    useArticle<string>("year");

  console.log(value);

  return (
    <div className="flex items-center space-x-[12px] bg-white selector cursor-pointer">
      <input
        className="bg-transparent cursor-pointer"
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
