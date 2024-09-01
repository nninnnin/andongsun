import useArticle from "@/hooks/useArticle";
import React from "react";

const Credits = () => {
  const { handleChange, value } =
    useArticle<string>("credits");

  return (
    <textarea
      className="credits input w-full resize-none outline-none"
      onChange={(e) => {
        handleChange(e.target.value);
      }}
      value={value ?? ""}
      placeholder="크레딧을 입력해 주세요."
    />
  );
};

export default Credits;
