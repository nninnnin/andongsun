import React from "react";
import {
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import {
  useParams,
  usePathname,
  useRouter,
} from "next/navigation";
import clsx from "clsx";
import { useSWRConfig } from "swr";

import {
  convertDOMToString,
  convertStringToDOM,
  createArticleBody,
} from "@/utils";
import useMemex from "@/hooks/useMemex";
import { articleState, mediaState } from "@/states";
import { getCategoryId } from "@/utils/index";
import useTags from "@/hooks/useTags";
import { useOverlay } from "@toss/use-overlay";
import Alert from "@/components/admin/common/Alert";
import Spinner from "@/components/admin/common/Spinner";
import { ArticleStateInterface } from "@/types/article";

const SubmitButton = () => {
  const { mutate } = useSWRConfig();

  const {
    postArticle,
    updateArticle,
    getArticleCategories,
    registerImage,
    readImage,
    postImage,
    postTag,
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

  const { data: tags } = useTags();

  const submitArticle = async (
    article: ArticleStateInterface
  ) => {
    const categories = await getArticleCategories();

    const categoryId = getCategoryId(
      article.articleType!,
      categories
    );

    let imagePath = "";

    const hasChangedThumbnail = !!article.thumbnail;

    if (hasChangedThumbnail) {
      const thumbnailName = article.thumbnail!.name;

      const hasImageAlready = await readImage(
        thumbnailName
      );

      if (hasImageAlready) {
        imagePath = hasImageAlready.data.path;
      } else {
        const registeredPath = await registerImage(
          article.thumbnail!
        );

        imagePath = registeredPath;

        await postImage(thumbnailName, registeredPath);
      }
    } else {
      imagePath = article.thumbnailPath!;
    }

    const articleBody = createArticleBody({
      ...article,
      articleType: categoryId,
      thumbnailPath: imagePath,
    });

    // 새로운 태그 세팅
    const newTags: Array<string> = [];

    const hasTag = tags!
      .map((tag) => tag.name)
      .includes(article.tag);

    if (hasTag) {
      const tagId = tags!.find(
        (tag) => tag.name === article.tag
      )!.id;

      newTags.push(tagId);
    } else {
      // 새롭게 태그를 등록해야 한다.
      const tagId = await postTag(article.tag);

      newTags.push(tagId);
    }

    articleBody.data.tags = newTags;

    // 새로운 컨텐츠 (이미지 매핑) 세팅
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
                style: dom?.getAttribute("style"),
                align: dom?.getAttribute("align"),
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
              style: dom?.getAttribute("style"),
              align: dom?.getAttribute("align"),
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

          const { path, name, width, style, align } =
            imagePath;

          const newImage = new Image();
          newImage.src = path;
          newImage.alt = name;
          newImage.setAttribute("style", style ?? "");
          newImage.setAttribute("align", align ?? "");

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
  };

  const overlay = useOverlay();

  const handleSubmit = async () => {
    overlay.open(({ close: closeAlert, isOpen }) => (
      <Alert
        show={isOpen}
        desc="등록하시겠습니까?"
        handleClose={() => closeAlert()}
        handleConfirm={async () => {
          if (article.articleType === null) {
            overlay.open(({ close, isOpen }) => (
              <Alert
                show={isOpen}
                desc="카테고리를 지정해주세요."
                handleClose={() => close()}
                handleConfirm={() => close()}
              />
            ));

            closeAlert();
            return;
          }

          if (!article.title) {
            overlay.open(({ close, isOpen }) => (
              <Alert
                show={isOpen}
                desc="제목을 입력해주세요."
                handleClose={() => close()}
                handleConfirm={() => close()}
              />
            ));

            closeAlert();
            return;
          }

          if (!article.contents) {
            overlay.open(({ close, isOpen }) => (
              <Alert
                show={isOpen}
                desc="내용을 입력해주세요."
                handleClose={() => close()}
                handleConfirm={() => close()}
              />
            ));

            closeAlert();
            return;
          }

          overlay.open(({ close: closeSpinner }) => {
            return (
              <Spinner
                contents="업로드 중입니다… ⌛…"
                onMount={async () => {
                  try {
                    closeAlert();

                    await submitArticle(article);

                    mutate("articles");

                    resetMediaContents();
                    resetArticle();

                    closeSpinner();
                    router.push("/admin");
                  } catch (error) {
                    closeSpinner();

                    overlay.open(
                      ({ close, isOpen }) => (
                        <Alert
                          show={isOpen}
                          desc="등록 실패, 시스템 오류"
                          handleClose={() => close()}
                          handleConfirm={() => close()}
                        />
                      )
                    );
                  }
                }}
              />
            );
          });
        }}
      />
    ));
  };

  return (
    <div
      className={clsx(
        "btn selector cursor-pointer mt-[-1px]",
        !tags && "pointer-events-none bg-slate-200"
      )}
      onClick={handleSubmit}
    >
      완료
      <object data="/arrow--right.svg" />
    </div>
  );
};

export default SubmitButton;
