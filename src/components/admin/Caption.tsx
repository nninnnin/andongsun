import React from "react";

import useArticle from "@/hooks/useArticle";

const Caption = () => {
  const { value, handleChange } =
    useArticle<string>("caption");

  return (
    <input
      type="text"
      className="w-full resize-none outline-none"
      onChange={(e) => handleChange(e.target.value)}
      value={value}
    />
  );
};

export default Caption;
