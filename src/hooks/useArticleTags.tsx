import { useEffect, useState } from "react";
import { map, filter, go } from "fxjs";
import { curry } from "lodash";

import useArticles from "@/hooks/useArticles";
import { uniqWith } from "@toss/utils";
import {
  filterHiddenArticle,
  filterRemovedArticle,
} from "@/utils/filters";
import { ArticleInterface } from "@/types/article";

interface Tag {
  uid: string;
  tagName: string;
}

const useArticleTags = () => {
  const [articleTags, setArticleTags] = useState<
    Tag[]
  >([]);

  const { data: articles } = useArticles();

  useEffect(() => {
    if (!articles) return;

    const tags = processArticlesToTags(articles);

    setArticleTags(tags);
  }, [articles]);

  return articleTags;
};

const processArticlesToTags = (
  articles: ArticleInterface[]
) =>
  go(
    articles,
    filterRemovedArticle,
    filterHiddenArticle,
    curry(map)(
      (article: { tags: Tag[] }) => article.tags[0]
    ),
    curry(filter)((el: Tag) => el),
    curry(filter)((el: Tag) => !!el.tagName),
    (list: any) =>
      uniqWith(
        list,
        (a: Tag, b: Tag) =>
          a.uid === b.uid && a.tagName === b.tagName
      )
  );

export default useArticleTags;
