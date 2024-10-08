import useArticle from "@/hooks/useArticle";
import React from "react";

const Title = () => {
  const { value, handleChange } =
    useArticle<string>("title");

  return (
    <input
      type="text"
      className="title input w-full resize-none outline-none h-[44px]"
      onChange={(e) => handleChange(e.target.value)}
      value={value}
      placeholder="[필수 입력] 리스트, 포스트에 공통으로 표시되는 제목입니다."
    />
  );
};

export default Title;
