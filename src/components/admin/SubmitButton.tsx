import React from "react";
import { useRecoilValue } from "recoil";

import { createArticleBody } from "@/utils";
import useMemex from "@/hooks/useMemex";
import { articleState } from "@/states";
import { getCategoryId } from "@/utils/index";

const SubmitButton = () => {
  const { postArticle, getArticleCategories } =
    useMemex();

  const article = useRecoilValue(articleState);

  const handleSubmit = async () => {
    if (article.articleType === null) {
      alert("카테고리를 지정해주세요.");
      return;
    }

    const categories = await getArticleCategories();

    console.log(article);
    console.log(categories);

    const categoryId = getCategoryId(
      article.articleType,
      categories
    );

    const articleBody = createArticleBody({
      ...article,
      articleType: categoryId,
    });

    console.log(articleBody);

    const createdArticleId = await postArticle(
      articleBody
    );

    console.log(createdArticleId);
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
