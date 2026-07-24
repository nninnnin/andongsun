// @ts-ignore
import Mf from "@rebel9/memex-fetcher";
import { processFilename } from "@/utils/submit";
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

export const readImage = async (imageName: string) => {
  const list = await readImagesByName(imageName);

  return list[0];
};

// 같은 이름으로 등록된 이미지가 여러 개일 수 있어서(파일명 중복),
// 첫 번째만 보지 않고 전체 후보를 돌려준다 - 호출부에서 해시로 진짜 같은 파일인지 가려낸다.
export const readImagesByName = async (
  imageName: string
) => {
  const sanitizedName = processFilename(imageName);

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
          condition: `{\"type\": \"EXACT", "language": "KO", \"keyword\": \"${sanitizedName}\"}`,
        },
      ],
    }
  );

  const result = await res.json();

  return result.list as Array<{
    data: {
      name: { KO: string };
      path: string;
      hash?: string;
    };
  }>;
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
  imageName: string,
  imagePath: string,
  hash?: string
) => {
  const result = await memexFetcher.postItem(
    PROJECT_ID,
    "images",
    JSON.stringify({
      publish: true,
      data: {
        name: {
          KO: processFilename(imageName),
        },
        path: imagePath,
        ...(hash ? { hash } : {}),
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
