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

// key는 이미지 파일명이 아니라 파일 내용의 해시값이다.
// 해시는 완전히 같은 파일에 대해서만 같은 값이 나오므로, 정확히 하나(있거나 없거나)만 매칭된다.
export const readImage = async (key: string) => {
  const res = await memexFetcher.getList(
    PROJECT_ID,
    "images",
    {
      size: 1,
      page: 0,
      searchConds: [
        {
          componentType: "TITLE",
          devKey: "name",
          language: "KO",
          condition: `{\"type\": \"EXACT", "language": "KO", \"keyword\": \"${key}\"}`,
        },
      ],
    }
  );

  const result = await res.json();

  return result.list[0] as
    | {
        data: {
          name: { KO: string };
          path: string;
        };
      }
    | undefined;
};

export const registerImage = async (
  image: File
): Promise<string> => {
  const result = await memexFetcher.postMedia(
    PROJECT_ID,
    image
  );

  return result.file.path;
};

export const postImage = async (
  key: string,
  imagePath: string
) => {
  const result = await memexFetcher.postItem(
    PROJECT_ID,
    "images",
    JSON.stringify({
      publish: true,
      data: {
        name: {
          KO: key,
        },
        path: imagePath,
      },
    })
  );

  return result;
};

export const getArticleCategories = async () => {
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
