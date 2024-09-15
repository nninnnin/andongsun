import React from "react";
import {
  useRecoilValue,
  useResetRecoilState,
} from "recoil";

import {
  convertDOMToString,
  convertStringToDOM,
  createArticleBody,
} from "@/utils";
import useMemex from "@/hooks/useMemex";
import { articleState, mediaState } from "@/states";
import {
  getCategoryId,
  getImageNameFromImageTagString,
} from "@/utils/index";
import {
  useParams,
  usePathname,
  useRouter,
} from "next/navigation";

const SubmitButton = () => {
  const {
    postArticle,
    updateArticle,
    getArticleCategories,
    registerImage,
    readImage,
    postImage,
  } = useMemex();

  const article = useRecoilValue(articleState);
  const mediaContents = useRecoilValue(mediaState);
  const resetMediaContents =
    useResetRecoilState(mediaState);
  const resetArticle =
    useResetRecoilState(articleState);

  const router = useRouter();
  const pathname = usePathname();
  const { articleId } = useParams();

  const isEditing = pathname.includes("edit");

  const handleSubmit = async () => {
    if (article.articleType === null) {
      alert("카테고리를 지정해주세요.");
      return;
    }

    if (!article.title) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!article.caption) {
      alert("캡션을 입력해주세요.");
      return;
    }

    if (!article.credits) {
      alert("크레딧을 입력해주세요.");
      return;
    }

    if (!article.contents) {
      alert("내용을 입력해주세요.");
      return;
    }

    const categories = await getArticleCategories();

    const categoryId = getCategoryId(
      article.articleType,
      categories
    );

    let imagePath = "";

    // thumbnail 등록
    if (article.thumbnail) {
      imagePath = await registerImage(
        article.thumbnail
      );
    }

    const articleBody = createArticleBody({
      ...article,
      articleType: categoryId,
      thumbnailPath: imagePath,
    });

    const contents = articleBody.data.contents;

    // search image tags on contents using regex
    const imageTagStrings = contents.match(
      /<img\s+[^>]*src="([^"]+)"[^>]*>/g
    );

    let newContents = `${contents}`;

    if (imageTagStrings) {
      const imagePaths = await Promise.all(
        imageTagStrings.map(
          async (tagString: string) => {
            const dom = convertStringToDOM(tagString);

            const imageName = dom?.alt || "";

            if (!imageName) {
              return false;
            }

            const hasImageAlready = await readImage(
              imageName
            );

            if (hasImageAlready) {
              return {
                name: imageName,
                path: hasImageAlready.data.path,
                width: dom?.getAttribute("width"),
              };
            }

            const media = mediaContents.find(
              (media) => media.name === imageName
            );

            if (!media) {
              return false;
            }

            const registeredPath = await registerImage(
              media.file
            );

            const result = await postImage(
              imageName,
              registeredPath
            );

            return {
              name: imageName,
              path: registeredPath,
              width: dom?.getAttribute("width"),
            };
          }
        )
      );

      newContents = newContents.replace(
        /<img\s+[^>]*src="([^"]+)"[^>]*>/g,
        () => {
          const imagePath = imagePaths.shift();

          if (!imagePath) {
            return "<img src='nothing' />";
          }

          const { path, name, width } = imagePath;

          const newImage = new Image();
          newImage.src = path;
          newImage.alt = name;

          if (width) {
            newImage.width = parseInt(width);
          }

          return convertDOMToString(newImage);
        }
      );
    }

    articleBody.data.contents = newContents;

    if (isEditing) {
      await updateArticle(
        articleId as string,
        articleBody
      );
    } else {
      await postArticle(articleBody);
    }

    resetMediaContents();
    resetArticle();

    router.push("/admin");
  };

  return (
    <div
      className="btn selector cursor-pointer mt-[-1px]"
      onClick={handleSubmit}
    >
      완료
      <object data="/arrow--right.svg" />
    </div>
  );
};

export default SubmitButton;
