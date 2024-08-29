import { ArticleBody } from "@/types/article";
import Mf from "@rebel9/memex-fetcher";

const {
  pipe,
  mapListItems,
  pluckList,
  deconstructLanguageMap,
} = Mf;

const memexFetcher = Mf.createMemexFetcher(
  process.env.MEMEX_TOKEN ?? ""
);

const PROJECT_ID = "cbbcc6cd";
const ARTICLE_MODEL_KEY = "articles";

const useMemex = () => {
  const postArticle = async (
    articleBody: ArticleBody
  ) => {
    const res = await memexFetcher.postItem(
      PROJECT_ID,
      ARTICLE_MODEL_KEY,
      JSON.stringify(articleBody)
    );

    return await res.text();
  };

  const getArticleCategories = async () => {
    const res = await memexFetcher.getCategories(
      PROJECT_ID,
      ARTICLE_MODEL_KEY
    );

    const result = await res.json();

    return pipe(
      result,
      pluckList,
      (
        list: Array<{
          categories: any;
        }>
      ) => list[0].categories,
      mapListItems((item: any) =>
        deconstructLanguageMap(item, "KO")
      )
    );
  };

  return {
    postArticle,
    getArticleCategories,
  };
};

export default useMemex;