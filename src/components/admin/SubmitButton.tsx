import React from "react";
import { useRecoilValue } from "recoil";

import { createArticleBody } from "@/utils";
import useMemex from "@/hooks/useMemex";
import { articleState } from "@/states";
import { getCategoryId } from "@/utils/index";
import {
  useParams,
  usePathname,
  useRouter,
} from "next/navigation";

const SubmitButton = () => {
  const {
    postArticle,
    updateArticle,
    getArticleCategories,
  } = useMemex();

  const article = useRecoilValue(articleState);

  const router = useRouter();
  const pathname = usePathname();
  const { articleId } = useParams();

  const isEditing = pathname.includes("edit");

  const handleSubmit = async () => {
    if (article.articleType === null) {
      alert("카테고리를 지정해주세요.");
      return;
    }

    if (!article.title) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!article.caption) {
      alert("캡션을 입력해주세요.");
      return;
    }

    if (!article.credits) {
      alert("크레딧을 입력해주세요.");
      return;
    }

    if (!article.contents) {
      alert("내용을 입력해주세요.");
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

    if (isEditing) {
      await updateArticle(
        articleId as string,
        articleBody
      );
    } else {
      await postArticle(articleBody);
    }

    router.push("/admin");
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
