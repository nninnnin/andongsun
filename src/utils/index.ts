import { format } from "date-fns";
import Mf from "@rebel9/memex-fetcher";
const {
  pipe,
  pluckList,
  mapListItems,
  pluckData,
  mapObjectProps,
  deconstructLanguageMap,
} = Mf;

import {
  ArticleBody,
  ArticleInterface,
  ArticleStateInterface,
  BareArticle,
} from "@/types/article";
import { SectionNames } from "@/constants";

type Argument = Omit<
  ArticleStateInterface,
  "articleType"
> & {
  articleType: number | null;
  remove?: boolean;
};

export const createArticleBody = (
  articleState: Argument
): ArticleBody => {
  const {
    published,
    articleType,
    title,
    year,
    contents,
    caption,
    credits,
    thumbnail,
    thumbnailPath,
    thumbnailName,
    remove,
  } = articleState;

  return {
    publish: true, // 이것으로는 아무것도 결정하지 않음, 항상 true
    data: {
      title: {
        KO: title!,
      },
      articleType: [articleType!],
      contents: contents!,
      caption: caption!,
      credits: credits!,
      producedAt: format(year, "yyyy.MM"),
      tags: [],
      thumbnailPath: thumbnailPath ?? "",
      thumbnailName:
        thumbnail?.name || thumbnailName || "",
      hidden: `${!published}`, // 이것으로 공개 여부 결정
      removed: `${Boolean(remove)}`, // 이것으로 삭제 여부 결정
    },
  };
};

export const getCategoryId = (
  categoryName: SectionNames,
  categories: Array<{
    id: number;
    category: SectionNames;
  }>
): number | null => {
  return (
    categories.find(
      (category) => category.category === categoryName
    )?.id ?? null
  );
};

export const transformArticles = (
  bareArticle: BareArticle
): ArticleInterface[] => {
  console.log(bareArticle);

  return pipe(
    bareArticle,
    pluckList,
    mapListItems((item: any) => {
      return {
        ...pluckData(item),
        id: item.uid,
        updatedAt: item.updateAt ?? item.createdAt,
      };
    }),
    mapListItems((item: any) => {
      const newItem = pipe(
        item,
        (item: any) =>
          mapObjectProps(
            item,
            ["title"],
            (title: { KO: string }) => title.KO
          ),
        (item: any) =>
          mapObjectProps(
            item,
            ["articleType"],
            (articleType: Array<{ KO: string }>) =>
              deconstructLanguageMap(
                articleType[0],
                "KO"
              )
          ),
        (item: any) =>
          mapObjectProps(
            item,
            ["tags"],
            mapListItems((tag: any) => {
              const newTag = {
                ...tag,
                tagName: deconstructLanguageMap(
                  tag,
                  "KO"
                ),
              };

              delete newTag.languageMap;
              delete newTag.type;
              delete newTag._id;

              return newTag;
            })
          )
      );

      return newItem;
    })
  );
};

export const converFileToBase64 = (file: File) => {
  const reader = new FileReader();

  return new Promise<string>((resolve) => {
    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.readAsDataURL(file);
  });
};

export const checkImageVaildity = (path: string) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = path;

    image.onload = () => resolve(true);
    image.onerror = () => reject(false);
  });
};

export const getImageNameFromImageTagString = (
  tagString: string
) => {
  // get image name dataset from tag string
  const imageNameMatched = tagString.match(
    /data-name\s*=\s*['"]([^'"]*?)['"]/
  );

  if (!imageNameMatched) return null;

  const imageName = imageNameMatched[1];

  return imageName;
};

export const convertStringToDOM = (str: string) => {
  let parser = new DOMParser();
  let doc = parser.parseFromString(str, "text/html");
  let imgElement = doc.querySelector("img");

  return imgElement;
};

export const convertDOMToString = (dom: Element) => {
  let div = document.createElement("div");
  div.appendChild(dom);

  return div.innerHTML;
};

export const removePrefixZero = (
  yearMonthString: string
) => {
  const [year, month] = yearMonthString.split(".");

  return `${parseInt(year)}.${parseInt(month)}`;
};
