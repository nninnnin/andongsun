import { format } from "date-fns";

import { ArticleStateInterface } from "@/states";
import { ArticleBody } from "@/types/article";

export const createArticleBody = (
  articleState: ArticleStateInterface
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
