import React from "react";
import { createArticleBody } from "@/utils";
import useMemex from "@/hooks/useMemex";
import { useRecoilValue } from "recoil";
import { articleState } from "@/states";

const SubmitButton = () => {
  const { postArticle, getArticleCategories } =
    useMemex();

  const article = useRecoilValue(articleState);

  const handleSubmit = async () => {
    const categories = await getArticleCategories();

    const createdArticleId = await postArticle(
      createArticleBody(article)
    );
  };

  return (
    <div
      className="bg-white border-[1px] border-black outline-none h-[30px] flex justify-center items-center px-3 whitespace-nowrap"
      onClick={handleSubmit}
    >
      제출하기
    </div>
  );
};

export default SubmitButton;
