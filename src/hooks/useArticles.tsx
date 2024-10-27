import { ArticleInterface } from "@/types/article";
import { transformArticles } from "@/utils";

// @ts-ignore
import Mf from "@rebel9/memex-fetcher";

const memexFetcher = Mf.createMemexFetcher(
  process.env.MEMEX_TOKEN ?? ""
);

const PROJECT_ID = "cbbcc6cd";
const ARTICLE_MODEL_KEY = "articles";

const fetchArticles = async () => {
  const res = await memexFetcher.getList(
    PROJECT_ID,
    ARTICLE_MODEL_KEY,
    {
      page: 0,
      size: 1000,
    }
  );

  const result = await res.json();

  return transformArticles(result);
};

import useSWR from "swr";

const useArticles = () => {
  const swr = useSWR<ArticleInterface[]>(
    "articles",
    fetchArticles
  );

  return {
    ...swr,
  };
};

export default useArticles;
