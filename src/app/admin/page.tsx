// @ts-nocheck
"use client";

import useArticles from "@/hooks/useArticles";
import { ArticleInterface } from "@/types/article";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const AdminPage = () => {
  const { data: articles } = useArticles();

  if (!articles) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-[90px] w-[60vw] min-w-[750px] mx-auto">
      <Link href="/admin/new">
        <button className="flex p-3 px-5 mt-3 mb-6 text-white bg-themeBlue">
          <span>New Project</span>
          <img className="ml-[40px]" src="/plus.svg" />
        </button>
      </Link>

      <AdminPage.ArticleList articles={articles} />
    </div>
  );
};

AdminPage.ArticleList = ({
  articles,
}: {
  articles: ArticleInterface[];
}) => {
  const router = useRouter();

  return (
    <>
      {articles
        .filter((article) => !article.removed)
        .map((article, index) => (
          <div
            className={clsx(
              "text-white text-[20px] flex space-x-10 border-b-[1px]",
              "mb-[24px] pb-[20px]",
              "cursor-pointer",
              "w-full overflow-hidden"
            )}
            onClick={() => {
              router.push(`/admin/edit/${article.id}`);
            }}
            key={`article-${article.id}`}
          >
            <h2 className="flex-1 min-w-[240px]">
              {article.title}
            </h2>

            <p className="flex-1 min-w-[200px] whitespace-nowrap truncate">
              {article.credits}
            </p>

            <p className="flex-1 min-w-[100px]">
              {article.articleType}
            </p>

            <p className="flex-1 min-w-[100px]">
              {article.tags[0]?.tagName}
            </p>

            <p className="min-w-[100px]">
              {article.producedAt}.
            </p>
          </div>
        ))}
    </>
  );
};

export default AdminPage;
