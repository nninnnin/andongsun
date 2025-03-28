import React from "react";

import useArticle from "@/hooks/useArticle";

const Caption = () => {
  const { value, handleChange } =
    useArticle<string>("caption");

  return (
    <textarea
      className="caption input min-w-full resize-none outline-none h-[88px] !mt-[-3px] !border-b-[0px]"
      onChange={(e) => handleChange(e.target.value)}
      value={value}
      placeholder="이미지 대신 주요 문장을 표시할 경우 입력해 주세요."
    />
  );
};

export default Caption;
