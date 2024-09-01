import React from "react";
import { useRecoilValue } from "recoil";

import { createArticleBody } from "@/utils";
import useMemex from "@/hooks/useMemex";
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
      className="btn selector"
      onClick={handleSubmit}
    >
      완료
      <object data="/arrow--right.svg" />
    </div>
  );
};

export default SubmitButton;
