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

import { ArticleStateInterface } from "@/states";
import {
  ArticleBody,
  ArticleInterface,
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
    }),
    (items: any) =>
      items.filter((item: any) => {
        if (!sectionName) return true;

        return item.articleType === sectionName;
      })
  );
};
