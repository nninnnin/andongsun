"use client";

import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useSWRConfig } from "swr";

import { getCategoryId } from "@/utils/index";
import useArticles from "@/hooks/useArticles";
import useMemex from "@/hooks/useMemex";
import { useOverlay } from "@toss/use-overlay";
import Spinner from "@/components/admin/common/Spinner";
import { useRouter } from "next/navigation";

const EditAbout = () => {
  const [value, setValue] = useState("");
  const [articleId, setArticleId] = useState("");

  useArticles();

  const { mutate } = useSWRConfig();

  useEffect(() => {
    (async function () {
      const articles = await mutate("articles");

      if (!articles) return;

      const about = articles.find(
        // @ts-ignore
        (article) =>
          article.articleType === "AboutEditor"
      );

      if (!about) return;

      const { contents, id } = about;

      setValue(contents);
      setArticleId(id);
    })();
  }, []);

  const router = useRouter();

  const { updateArticle, getArticleCategories } =
    useMemex();

  const handleSubmit = async () => {
    const categories = await getArticleCategories();

    const categoryId = getCategoryId(
      // @ts-ignore
      "AboutEditor",
      categories
    );

    updateArticle(articleId, {
      publish: true,
      data: {
        title: {
          KO: "Dongsun An",
        },
        articleType: [categoryId!],
        contents: value,
        caption: "",
        credits: "",
        producedAt: "",
        tags: [],
        thumbnailPath: "",
        thumbnailName: "",
        hidden: "false",
        removed: "false",
      },
    });
  };

  const overlay = useOverlay();

  return (
    <div>
      <div
        className={clsx(
          "editor",
          "w-[60vw] min-w-[750px] h-full mx-auto",
          "flex flex-col justify-start items-center",
          "fixed left-1/2 -translate-x-1/2 top-[90px]"
        )}
      >
        <textarea
          className="w-full h-[50vh] resize-none outline-none p-3"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <button
        className="p-3 py-2 bg-themeBlue border-white border-[1px] text-white fixed right-[28px] top-[15px]"
        onClick={async () => {
          if (!articleId) return;

          overlay.open(() => (
            <Spinner
              contents="수정 중입니다… ⌛…"
              onMount={async () => {
                await handleSubmit();

                mutate("articles");

                overlay.close();

                router.push("/admin");
              }}
            />
          ));
        }}
      >
        수정하기
      </button>
    </div>
  );
};

export default EditAbout;
