import { SectionNames } from "@/constants";
import { atom } from "recoil";

export const articleDefault = {
  published: false,
  articleType: null,
  thumbnail: null,
  caption: null,
  title: null,
  year: null,
  credits: null,
  contents: null,
};

export const articleState = atom<{
  published: boolean;
  articleType: SectionNames | null;
  thumbnail: File | null;
  caption: null | string;
  title: null | string;
  year: null | string;
  credits: null | string;
  contents: null | string;
}>({
  key: "articleState",
  default: articleDefault,
});
