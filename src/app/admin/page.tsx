// @ts-nocheck
"use client";

import useArticles from "@/hooks/useArticles";
import Link from "next/link";
import React from "react";

const AdminPage = () => {
  const articles = useArticles();

  if (!articles) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pl-10">
      <Link href="/admin/new">
        <button className="text-white bg-themeBlue p-3 mb-6 mt-3 px-5">
          New Project
        </button>
      </Link>

      {articles.list.map((article, index) => (
        <div
          className="text-white text-[1.5em] flex space-x-10 border-b-[1px] mb-3"
          key={`article-${index}`}
        >
          <span>{index + 1}</span>

          <h2 className="flex-1">
            {article.data.title.KO}
          </h2>
          <p className="flex-1">
            {article.data.caption}
          </p>
          <p
            className="flex-1"
            dangerouslySetInnerHTML={{
              __html: article.data.contents,
            }}
          ></p>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
