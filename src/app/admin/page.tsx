"use client";

import { SectionNames } from "@/constants";
import useArticles from "@/hooks/useArticles";
import { ArticleInterface } from "@/types/article";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { orderBy } from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const AdminPage = () => {
  const { data: articles } = useArticles();

  return (
    <AnimatePresence>
      {articles ? (
        <div className="mt-[90px] w-[60vw] min-w-[750px] mx-auto">
          <Link
            className="block w-fit"
            href="/admin/new"
          >
            <button className="flex items-center p-3 px-5 mt-3 text-white bg-themeBlue">
              <span>New Project</span>
              <img
                className="ml-[40px]"
                src="/plus.svg"
              />
            </button>
          </Link>

          <AdminPage.ArticleList articles={articles} />
        </div>
      ) : (
        <></>
      )}
    </AnimatePresence>
  );
};

const Noom = () => {
  return (
    <motion.div
      className="w-[60vw] min-w-[750px] rounded-md mx-auto bg-slate-100 mt-[90px] h-[calc(100dvh-150px)] bg-opacity-5"
      initial={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      exit={{
        opacity: 0,
      }}
    ></motion.div>
  );
};

AdminPage.ArticleList = ({
  articles,
}: {
  articles: ArticleInterface[];
}) => {
  const router = useRouter();

  const articlesFiltered = articles
    .filter((article) => !article.removed)
    .filter(
      (article) =>
        // @ts-ignore
        article.articleType !== "AboutEditor"
    );

  const articlesSorted = orderBy(
    articlesFiltered,
    ["producedAt", "updatedAt"],
    ["desc", "desc"]
  );

  return (
    <ul className="mt-[33px]">
      <AdminPage.ArticleListItem
        title={"소개"}
        credits={""}
        articleType={SectionNames.About}
        producedAt={""}
        tag={""}
        handleClick={() => {
          router.push(`/admin/about`);
        }}
      />

      {articlesSorted.map((article, index) => {
        const {
          id,
          title,
          credits,
          articleType,
          producedAt,
          tags,
        } = article;

        return (
          <AdminPage.ArticleListItem
            key={id}
            title={title}
            credits={credits}
            articleType={articleType}
            producedAt={producedAt}
            tag={tags[0]?.tagName}
            handleClick={() => {
              router.push(`/admin/edit/${id}`);
            }}
          />
        );
      })}
    </ul>
  );
};

AdminPage.ArticleListItem = ({
  title,
  credits,
  articleType,
  tag,
  producedAt,
  handleClick,
}: {
  title: string;
  credits: string;
  articleType: string;
  tag: string;
  producedAt: string;
  handleClick: () => void;
}) => {
  return (
    <div
      className={clsx(
        "text-white text-large flex space-x-10 border-b-[1px]",
        "pt-[24px] first:pt-0 pb-[20px]",
        "cursor-pointer",
        "w-full overflow-hidden",
        "hover:border-themeBlue hover:!text-themeBlue transition-all duration-[400]"
      )}
      onClick={handleClick}
    >
      <h2 className="flex-1 min-w-[240px]">{title}</h2>

      <p className="flex-1 min-w-[200px] whitespace-nowrap truncate">
        {credits}
      </p>

      <p className="flex-1 min-w-[100px]">
        {articleType}
      </p>

      <p className="flex-1 min-w-[100px]">{tag}</p>

      <p className="min-w-[100px]">
        {producedAt ? `${producedAt}.` : ""}
      </p>
    </div>
  );
};

export default AdminPage;
