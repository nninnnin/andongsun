import { ArticleStateInterface } from "@/types/article";
import { atom } from "recoil";

export const articleDefault = {
  published: false,
  articleType: null,
  caption: "",
  title: "",
  year: "",
  credits: "",
  contents: "",
  thumbnail: null,
  thumbnailPath: null,
  thumbnailName: null,
  tag: "",
};

export const articleState =
  atom<ArticleStateInterface>({
    key: "articleState",
    default: articleDefault,
  });

export const mediaState = atom<
  Array<{
    name: string;
    file: File;
  }>
>({
  key: "mediaState",
  default: [],
});
