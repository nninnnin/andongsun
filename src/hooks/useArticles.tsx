import { SectionNames } from "@/constants";
import { BareArticle } from "@/types/article";
import { transformArticles } from "@/utils";
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

  return await res.json();
};

import useSWR from "swr";

const useArticles = (sectionName?: SectionNames) => {
  const swr = useSWR<BareArticle>(
    "articles",
    fetchArticles
  );

  const formattedData = swr.data
    ? transformArticles(swr.data, sectionName)
    : undefined;

  return {
    ...swr,
    data: formattedData,
    isLoading: swr.isLoading || !formattedData,
  };
};

export default useArticles;
