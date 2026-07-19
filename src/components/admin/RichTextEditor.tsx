"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import React, {
  LegacyRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactQuill, { Quill } from "react-quill";
import { atom } from "recoil";
import { ImageFormat } from "@/lib/quill/ImageFormat";

// @ts-ignore
import ImageResize from "quill-image-resize";

Quill.register("modules/ImageResize", ImageResize);
Quill.register(ImageFormat, true);
import "react-quill/dist/quill.snow.css";

var icons = Quill.import("ui/icons");

icons["video"] = '<i class="ql-video-icon"></i>';

import useArticle from "@/hooks/useArticle";
import { mediaState } from "@/states";
import useImageHandler from "@/hooks/useImageHandler";
import useSlideHandler from "@/hooks/useSlideHandler";
import Script from "next/script";
import useLinkHandler from "@/hooks/useLinkHandler";

export const richEditorLoadedState = atom({
  key: "richEditorLoadedState",
  default: false,
});

export const quillRefState = atom<ReactQuill | null>({
  key: "quillRefState",
  default: null,
});

const DynamicReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    return ({
      forwardedRef,
      ...props
    }: {
      forwardedRef: LegacyRef<ReactQuill>;
    }) => {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  {
    ssr: false,
    loading: () => (
      <RichTextEditor.LoadingPlaceholder hasContents />
    ),
  },
);

const RichTextEditor = () => {
  const { handleChange, value } =
    useArticle<string>("contents");

  const [quillRef, setQuillRef] =
    useState<ReactQuill | null>(null);

  const quillStore = useRef<ReactQuill | null>(null);

  useEffect(() => {
    if (!quillRef) return;

    if (!quillRef.value) {
      const editor = quillRef.getEditor();

      editor.clipboard.addMatcher(
        ".ql-slide",
        (node, delta) => {
          const images = node.querySelectorAll("img");

          return {
            ...delta,
            ops: [
              {
                insert: {
                  slide: {
                    images: [...images].map(
                      (img: HTMLImageElement) => ({
                        src:
                          img.getAttribute("src") ||
                          "",
                        alt:
                          img.getAttribute("alt") ||
                          "",
                      }),
                    ),
                  },
                },
              },
            ],
          };
        },
      );

      // editor.clipboard.dangerouslyPasteHTML(value);

      const converted =
        editor.clipboard.convert(value);

      editor.updateContents(converted);

      quillRef.getEditor().on("editor-change", () => {
        handleChange(
          quillRef.getEditor().root.innerHTML,
        );
      });
    }
  }, [quillRef, value]);

  const { imageHandler } = useImageHandler(quillStore);
  const { slideHandler } = useSlideHandler(quillStore);
  const { linkHandler } = useLinkHandler(quillStore);

  return (
    <div className="w-full h-full">
      <Script
        strategy="afterInteractive"
        src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
        onLoad={() =>
          console.log("Swiper script is imported")
        }
      ></Script>

      {useMemo(
        () => (
          <DynamicReactQuill
            // @ts-ignore
            className={clsx(
              "w-full h-full bg-white flex flex-col overflow-hidden",
            )}
            // @ts-ignore
            onChange={handleChange}
            theme="snow"
            value={value}
            forwardedRef={(ref) => {
              setQuillRef(ref);
              quillStore.current = ref;
            }}
            modules={{
              toolbar: {
                container: [
                  ["bold", "underline", "italic"],
                  ["image", "video", "link"],
                ],
                handlers: {
                  image: imageHandler,
                  video: slideHandler,
                  link: linkHandler,
                },
              },
              ImageResize: {
                parchment: Quill.import("parchment"),
              },
            }}
          />
        ),
        [],
      )}
    </div>
  );
};

RichTextEditor.LoadingPlaceholder = ({
  hasContents,
}: {
  hasContents: boolean;
}) => {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="ql-toolbar ql-snow min-h-[44px] flex items-center pl-[20px]">
        {hasContents && (
          <div className="bg-slate-100 w-[130px] h-[calc(20px)] rounded-md"></div>
        )}
      </div>

      <div className="ql-container ql-snow p-[20px] space-y-[20px] flex !flex-col !justify-start !items-start">
        {hasContents && (
          <>
            <div className="bg-slate-100 w-[300px] h-[18px] rounded-md"></div>
            <div className="bg-slate-100 w-[80%] h-[18px] rounded-md"></div>
            <div className="bg-slate-100 w-[60%] h-[18px] rounded-md"></div>
            <div className="bg-slate-100 w-[400px] h-[200px] rounded-md"></div>
            <div className="bg-slate-100 w-[200px] h-[18px] rounded-md"></div>
            <div className="bg-slate-100 w-[100px] h-[18px] rounded-md"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
