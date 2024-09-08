// @ts-nocheck
"use client";

import useArticles from "@/hooks/useArticles";
import Link from "next/link";
import React from "react";

const AdminPage = () => {
  const {
    data: articles,
    isLoading,
    error,
  } = useArticles();

  if (!articles) {
    return <div>Loading...</div>;
  }

  console.log(articles);

  return (
    <div className="pl-10">
      <Link href="/admin/new">
        <button className="text-white bg-themeBlue p-3 mb-6 mt-3 px-5">
          New Project
        </button>
      </Link>

      {articles.map((article, index) => (
        <div
          className="text-white text-[1.5em] flex space-x-10 border-b-[1px] mb-3"
          key={`article-${article.id}`}
        >
          <span>{index + 1}</span>

          <h2 className="flex-1">{article.title}</h2>
          <p className="flex-1">{article.caption}</p>
          <p
            className="flex-1"
            dangerouslySetInnerHTML={{
              __html: article.contents,
            }}
          ></p>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
