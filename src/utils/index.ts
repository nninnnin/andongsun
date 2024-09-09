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
};

export const createArticleBody = (
  articleState: Argument
): ArticleBody => {
  const {
    published,
    articleType,
    title,
    contents,
    caption,
    credits,
    thumbnailPath,
    thumbnailName,
  } = articleState;

  return {
    publish: published,
    data: {
      title: {
        KO: title!,
      },
      articleType: [articleType!],
      contents: contents!,
      caption: caption!,
      credits: credits!,
      producedAt: format(new Date(), "yyyy.MM"),
      tags: [],
      thumbnailPath: thumbnailPath ?? "",
      thumbnailName: thumbnailName ?? "",
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
  bareArticle: BareArticle,
  sectionName?: SectionNames
): ArticleInterface[] => {
  return pipe(
    bareArticle,
    pluckList,
    mapListItems((item: any) => {
      return { ...pluckData(item), id: item.uid };
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
          )
        // (item: any) =>
        //   mapObjectProps(
        //     item,
        //     ["tags"],
        //     mapListItems((tag: any) => {
        //       const newTag = {
        //         ...tag,
        //         tagName: deconstructLanguageMap(
        //           tag,
        //           "KO"
        //         ),
        //       };

        //       delete newTag.languageMap;
        //       delete newTag.type;
        //       delete newTag._id;

        //       return newTag;
        //     })
        //   )
      );

      return newItem;
    }),
    (items: any) =>
      items.filter((item: any) => {
        if (!sectionName) return true;

        return item.articleType === sectionName;
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
