import clsx from "clsx";
import React from "react";
import { useRecoilValue } from "recoil";
import { useParams } from "next/navigation";
import { useOverlay } from "@toss/use-overlay";

import useMemex from "@/hooks/useMemex";
import { articleState } from "@/states";
import { createArticleBody } from "@/utils";
import { getCategoryId } from "@/utils/index";
import Alert from "@/components/admin/common/Alert";

const DeleteButton = () => {
  const overlay = useOverlay();

  const { articleId } = useParams();

  const { updateArticle, getArticleCategories } =
    useMemex();

  const article = useRecoilValue(articleState);

  const removeArticle = async () => {
    const categories = await getArticleCategories();
    const categoryId = getCategoryId(
      article.articleType!,
      categories
    );

    const articleBody = createArticleBody({
      ...article,
      articleType: categoryId,
      thumbnailPath: "",
      remove: true,
    });

    // soft delete using memex publish
    await updateArticle(
      articleId as string,
      articleBody
    );

    // redirect to admin page
    window.location.href = "/admin";
  };

  const handleClick = async () => {
    overlay.open(({ close, isOpen }) => (
      <Alert
        show={isOpen}
        desc="정말 삭제하시겠습니까?"
        handleClose={() => close()}
        handleConfirm={async () =>
          await removeArticle()
        }
      />
    ));
  };

  return (
    <div
      className={clsx(
        "cursor-pointer btn selector bg-[#333333]"
      )}
      onClick={handleClick}
    >
      삭제
      <object data="/remove.svg" />
    </div>
  );
};

export default DeleteButton;
