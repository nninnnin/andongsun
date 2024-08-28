import { ArticleBody } from "@/types/article";
import Mf from "@rebel9/memex-fetcher";

const memexFetcher = Mf.createMemexFetcher(
  process.env.MEMEX_TOKEN ?? ""
);

const PROJECT_ID = "abc123";
const ARTICLE_MODEL_KEY = "article";

const useMemex = () => {
  const postArticle = async (
    articleBody: ArticleBody
  ) => {
    return await memexFetcher.postItem(
      PROJECT_ID,
      ARTICLE_MODEL_KEY,
      JSON.stringify(articleBody)
    );
  };

  return {
    postArticle,
  };
};

export default useMemex;
