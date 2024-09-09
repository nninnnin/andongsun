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
      mapListItems((item: any) => ({
        id: item.id,
        category: deconstructLanguageMap(item, "KO"),
      }))
    );
  };

  const updateArticle = async (
    articleId: string,
    newArticle: ArticleBody
  ) => {
    const result = await memexFetcher.updateItem(
      PROJECT_ID,
      ARTICLE_MODEL_KEY,
      JSON.stringify({
        uid: articleId,
        ...newArticle,
      })
    );

    console.log("Update result", result);
  };

  const registerImage = async (image: File) => {
    const result = await memexFetcher.postMedia(
      PROJECT_ID,
      image
    );

    console.log("postMedia result", result);

    return result.file.path;
  };

  return {
    postArticle,
    updateArticle,
    getArticleCategories,
    registerImage,
  };
};

export default useMemex;
