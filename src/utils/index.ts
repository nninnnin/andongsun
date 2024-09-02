import { format } from "date-fns";

import { ArticleStateInterface } from "@/states";
import { ArticleBody } from "@/types/article";
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
