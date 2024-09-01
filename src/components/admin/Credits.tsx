import useArticle from "@/hooks/useArticle";
import React from "react";

const Credits = () => {
  const { handleChange, value } =
    useArticle<string>("credits");

  return (
    <textarea
      className="w-full resize-none outline-none"
      onChange={(e) => {
        handleChange(e.target.value);
      }}
      value={value ?? ""}
    />
  );
};

export default Credits;
