// @ts-nocheck
"use client";

import useArticles from "@/hooks/useArticles";
import { ArticleInterface } from "@/types/article";
import clsx from "clsx";
import { orderBy, reverse, sortBy } from "lodash";
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
      <Link className="block w-fit" href="/admin/new">
        <button className="flex items-center p-3 px-5 mt-3 text-white bg-themeBlue">
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

  const articlesFiltered = articles.filter(
    (article) => !article.removed
  );

  const articlesSorted = orderBy(
    articlesFiltered,
    ["producedAt", "updatedAt"],
    ["desc", "desc"]
  );

  return (
    <ul className="mt-[33px]">
      {articlesSorted.map((article, index) => (
        <div
          className={clsx(
            "text-white text-large flex space-x-10 border-b-[1px]",
            "pt-[24px] first:pt-0 pb-[20px]",
            "cursor-pointer",
            "w-full overflow-hidden",
            "hover:border-themeBlue hover:!text-themeBlue transition-all duration-[400]"
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
    </ul>
  );
};

export default AdminPage;
