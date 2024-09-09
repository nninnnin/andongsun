// @ts-nocheck
"use client";

import useArticles from "@/hooks/useArticles";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const AdminPage = () => {
  const router = useRouter();

  const {
    data: articles,
    isLoading,
    error,
  } = useArticles();

  if (!articles) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-10">
      <Link href="/admin/new">
        <button className="text-white bg-themeBlue p-3 mb-6 mt-3 px-5">
          New Project
        </button>
      </Link>

      {articles.map((article, index) => (
        <div
          className={clsx(
            "text-white text-[20px] flex space-x-10 border-b-[1px]",
            "mb-[24px] pb-[20px]",
            "cursor-pointer"
          )}
          onClick={() => {
            router.push(`/admin/edit/${article.id}`);
          }}
          key={`article-${article.id}`}
        >
          <h2 className="flex-1">{article.title}</h2>

          <p className="flex-1">{article.credits}</p>

          <p className="flex-1">
            {article.articleType}
          </p>

          {/* <p className="flex-1">
            {article.tags[0].tagName}
          </p> */}

          <p>{article.producedAt}.</p>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
