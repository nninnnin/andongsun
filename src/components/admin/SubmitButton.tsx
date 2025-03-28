"use client";

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

import { createArticleBody } from "@/utils";
import useMemex from "@/hooks/useMemex";
import {
  articleState,
  mediaState,
  slideMediaState,
} from "@/states";
import useTags from "@/hooks/useTags";
import { useOverlay } from "@toss/use-overlay";
import Alert from "@/components/admin/common/Alert";
import Spinner from "@/components/admin/common/Spinner";
import { ArticleStateInterface } from "@/types/article";
import { mapImageTags } from "@/utils/submit/mapImageTags";
import { mapContentsTags } from "@/utils/submit/mapContentsTags";

const SubmitButton = () => {
  const { mutate } = useSWRConfig();

  const { postArticle, updateArticle } = useMemex();

  const article = useRecoilValue(articleState);
  const mediaContents = useRecoilValue(mediaState);
  const slideMediaContents = useRecoilValue(
    slideMediaState
  );

  const resetMediaContents =
    useResetRecoilState(mediaState);
  const resetArticle =
    useResetRecoilState(articleState);

  const router = useRouter();
  const pathname = usePathname();
  const { articleId } = useParams();

  const isEditing = pathname.includes("edit");

  const { data: tags, getTagId } = useTags();

  const submitArticle = async (
    article: ArticleStateInterface
  ) => {
    // 1. 아티클 바디 생성
    const articleBody = await createArticleBody(
      article
    );

    // 2. 바디에 새로운 태그 세팅
    const tagId = await getTagId(article.tag);

    articleBody.data.tags = [tagId];

    // 3. 바디에 새로운 컨텐츠 세팅
    const contents = articleBody.data.contents;
    const mediaFiles = [
      ...mediaContents,
      ...slideMediaContents,
    ];

    const mappedContents = await mapContentsTags(
      contents,
      mediaFiles
    );

    articleBody.data.contents = mappedContents;

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
