import { useEffect, useState } from "react";

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

const useArticles = () => {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    fetchArticles().then((articles) =>
      setArticles(articles)
    );
  }, []);

  return articles;
};

export default useArticles;
