import { SectionNames } from "@/constants";
import { ArticleInterface } from "@/types/article";
// @ts-ignore
import Mf from "@rebel9/memex-fetcher";

const { pipe } = Mf;

export const filterRemovedArticle = (
  articles: ArticleInterface[]
) => {
  return articles.filter((article) => {
    return !article.removed;
  });
};

export const filterHiddenArticle = (
  articles: ArticleInterface[]
) => {
  return articles.filter((article) => {
    return !article.hidden;
  });
};

export const filterArticleBySection = (
  articles: ArticleInterface[],
  sectionName: SectionNames
) => {
  return articles.filter((article) => {
    return article.articleType === sectionName;
  });
};

export const filterArticleByTag = (
  articles: ArticleInterface[],
  tag: string | null
) => {
  if (tag === null) return articles;

  return articles.filter((article) => {
    if (!article.tags || !article.tags[0])
      return false;

    return article.tags.some(
      (articleTag) => articleTag.tagName === tag
    );
  });
};

export const filterArticleList = (
  articles: ArticleInterface[],
  sectionName: SectionNames,
  tag: string | null
): ArticleInterface[] => {
  return pipe(
    articles,
    (articles: ArticleInterface[]) =>
      filterRemovedArticle(articles),
    (articles: ArticleInterface[]) =>
      filterHiddenArticle(articles),
    (articles: ArticleInterface[]) =>
      filterArticleBySection(articles, sectionName),
    (articles: ArticleInterface[]) =>
      filterArticleByTag(articles, tag)
  );
};
