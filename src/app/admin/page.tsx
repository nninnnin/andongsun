"use client";

import clsx from "clsx";
import React from "react";
import { AnimatePresence } from "framer-motion";
import { orderBy } from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";

import { SectionNames } from "@/constants";
import useArticles from "@/hooks/useArticles";
import { ArticleInterface } from "@/types/article";
import TagFilter, {
  tagFilterState,
  필터기본값 as 태그필터기본값,
} from "@/components/admin/TagFilter";
import CategoryFilter, {
  categoryFilterState,
  필터기본값 as 카테고리필터기본값,
} from "@/components/admin/CategoryFilter";

const AdminPage = () => {
  const { data: articles } = useArticles();

  const categoryFilter = useRecoilValue(
    categoryFilterState
  );

  const tagFilter = useRecoilValue(tagFilterState);

  if (!articles) return <></>;

  const filteredArticles = articles
    .filter((article) => {
      const noCategoryFilter =
        categoryFilter === 카테고리필터기본값;

      if (noCategoryFilter) {
        return true;
      }

      return article.articleType === categoryFilter;
    })
    .filter((article) => {
      if (tagFilter === 태그필터기본값) {
        return true;
      }

      return article.tags[0]?.tagName === tagFilter;
    });

  return (
    <AnimatePresence>
      <AdminPage.Container>
        <AdminPage.Header>
          <AdminPage.NewArticleButton />

          <div className="flex space-x-[1.7em]">
            <CategoryFilter />
            <TagFilter />
          </div>
        </AdminPage.Header>

        <AdminPage.ArticleList
          articles={filteredArticles}
        />
      </AdminPage.Container>
    </AnimatePresence>
  );
};

AdminPage.Container = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="mt-[90px] w-[60vw] min-w-[750px] mx-auto h-fit">
      {children}
    </div>
  );
};

AdminPage.Header = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex justify-between items-end">
      {children}
    </div>
  );
};

AdminPage.NewArticleButton = () => {
  return (
    <Link className="block w-fit" href="/admin/new">
      <button className="flex items-center p-3 px-5 text-white bg-themeBlue">
        <span>New Project</span>
        <img className="ml-[40px]" src="/plus.svg" />
      </button>
    </Link>
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
      <p className="text-center w-[60px]">
        {articleType}
      </p>

      <p className="text-center w-[50px]">{tag}</p>

      <h2 className="flex-1 min-w-[240px]">{title}</h2>

      <p className="min-w-[100px] text-right">
        {producedAt ? `${producedAt}.` : ""}
      </p>
    </div>
  );
};

export default AdminPage;
