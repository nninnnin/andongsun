import React from "react";

import useArticle from "@/hooks/useArticle";

const Credits = () => {
  const { handleChange, value } =
    useArticle<string>("credits");

  return (
    <textarea
      className="credits input w-full resize-none outline-none h-[88px] !mb-[-2px] text-[12px] placeholder:text-[12px]"
      onChange={(e) => {
        handleChange(e.target.value);
      }}
      value={value ?? ""}
      placeholder="크레딧을 입력해 주세요."
    />
  );
};

export default Credits;
