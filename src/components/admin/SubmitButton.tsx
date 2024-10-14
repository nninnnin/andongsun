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
import Mf from "@rebel9/memex-fetcher";

const { pipe } = Mf;

import { createArticleBody } from "@/utils";
import useMemex from "@/hooks/useMemex";
import { articleState, mediaState } from "@/states";
import useTags from "@/hooks/useTags";
import { useOverlay } from "@toss/use-overlay";
import Alert from "@/components/admin/common/Alert";
import Spinner from "@/components/admin/common/Spinner";
import { ArticleStateInterface } from "@/types/article";
import {
  replaceImageTags,
  tagStringsToPaths,
} from "@/utils/submit";
import { matchImageTags } from "@/utils/matcher";

const SubmitButton = () => {
  const { mutate } = useSWRConfig();

  const { postArticle, updateArticle, postTag } =
    useMemex();

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
    // 아티클 바디 생성
    const articleBody = await createArticleBody(
      article
    );

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
      const tagId = await postTag(article.tag);

      newTags.push(tagId);
    }

    articleBody.data.tags = newTags;

    // 새로운 컨텐츠 (이미지 매핑) 세팅
    const contents = articleBody.data.contents;

    // search image tags on contents using regex
    const imageTagStrings = matchImageTags(contents);

    let newContents = `${contents}`;

    if (imageTagStrings) {
      newContents = pipe(
        await tagStringsToPaths(
          imageTagStrings,
          mediaContents
        ),
        (imagePaths: Array<Record<string, string>>) =>
          replaceImageTags(imagePaths, newContents)
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

                    console.log(
                      "업로드 중 에러 발생:",
                      error
                    );

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
