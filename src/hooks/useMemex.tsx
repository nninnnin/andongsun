import { ArticleBody } from "@/types/article";
// @ts-ignore
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
    return await memexFetcher.updateItem(
      PROJECT_ID,
      ARTICLE_MODEL_KEY,
      JSON.stringify({
        uid: articleId,
        ...newArticle,
      })
    );
  };

  const registerImage = async (image: File) => {
    const result = await memexFetcher.postMedia(
      PROJECT_ID,
      image
    );

    return result.file.path;
  };

  const readImage = async (imageName: string) => {
    const res = await memexFetcher.getList(
      PROJECT_ID,
      "images",
      {
        size: 9999,
        page: 0,
        searchConds: [
          {
            componentType: "TITLE",
            devKey: "name",
            language: "KO",
            condition: `{\"type\": \"EXACT", "language": "KO", \"keyword\": \"${imageName}\"}`,
          },
        ],
      }
    );

    const result = await res.json();

    return result.list[0];
  };

  const postImage = async (
    imageName: string,
    imagePath: string
  ) => {
    const result = await memexFetcher.postItem(
      PROJECT_ID,
      "images",
      JSON.stringify({
        publish: true,
        data: {
          name: {
            KO: imageName,
          },
          path: imagePath,
        },
      })
    );

    return result;
  };

  const getTags = async (): Promise<
    {
      id: string;
      name: string;
    }[]
  > => {
    const res = await memexFetcher.getList(
      PROJECT_ID,
      "tags",
      {
        size: 9999,
        page: 0,
      }
    );

    const result = await res.json();

    return pipe(
      result,
      pluckList,
      mapListItems((item: any) => {
        const { data, uid } = item;

        return {
          id: uid,
          name: data.name["KO"],
        };
      })
    );
  };

  const postTag = async (tagName: string) => {
    const res = await memexFetcher.postItem(
      PROJECT_ID,
      "tags",
      JSON.stringify({
        publish: true,
        data: {
          name: {
            KO: tagName,
          },
        },
      })
    );

    return await res.text();
  };

  return {
    postArticle,
    updateArticle,
    getArticleCategories,
    registerImage,
    readImage,
    postImage,
    getTags,
    postTag,
  };
};

export default useMemex;
