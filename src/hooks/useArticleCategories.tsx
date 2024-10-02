import { useEffect, useState } from "react";
import useArticles from "@/hooks/useArticles";
import { uniqWith } from "@toss/utils";
import {
  filterHiddenArticle,
  filterRemovedArticle,
} from "@/utils/filters";

const useArticleCategories = () => {
  const [categories, setCategories] = useState<
    string[]
  >([]);

  const { data: articles } = useArticles();

  useEffect(() => {
    if (!articles) return;

    const categories = uniqWith(
      filterHiddenArticle(
        filterRemovedArticle(articles)
      )
        .map((article) => article.articleType)
        .filter((el) => el)
        .filter(
          // @ts-ignore
          (category) => category !== "AboutEditor"
        ),
      (a, b) => a === b
    );

    setCategories(categories);
  }, [articles]);

  return categories;
};

export default useArticleCategories;
