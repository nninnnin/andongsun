import useArticle from "@/hooks/useArticle";
import React from "react";

const Title = () => {
  const { value, handleChange } =
    useArticle<string>("title");

  return (
    <div className="flex">
      <input
        type="text"
        className="w-full resize-none outline-none"
        onChange={(e) => handleChange(e.target.value)}
        value={value}
      />
    </div>
  );
};

export default Title;
