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
import { useSetRecoilState } from "recoil";

// @ts-ignore
import ImageResize from "quill-image-resize";
Quill.register("modules/ImageResize", ImageResize);
import "react-quill/dist/quill.snow.css";

import useArticle from "@/hooks/useArticle";
import { articleState, mediaState } from "@/states";
import { converFileToBase64 } from "@/utils/index";

const RichTextEditor = () => {
  const { handleChange, value } =
    useArticle<string>("contents");

  const setMediaContents =
    useSetRecoilState(mediaState);

  const ReactQuill = dynamic(
    async () => {
      const { default: RQ } = await import(
        "react-quill"
      );

      return ({
        forwardedRef,
        ...props
      }: {
        forwardedRef: LegacyRef<ReactQuill>;
      }) => <RQ ref={forwardedRef} {...props} />;
    },
    { ssr: false }
  );

  const [quillRef, setQuillRef] =
    useState<ReactQuill | null>(null);

  const quillStore = useRef<ReactQuill | null>(null);

  useEffect(() => {
    if (!quillRef) return;

    quillStore.current = quillRef;

    if (!quillRef.value) {
      quillRef
        .getEditor()
        .clipboard.dangerouslyPasteHTML(value);
    }
  }, [quillRef, value]);

  const imageHandler = () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.addEventListener("change", async (e) => {
      // @ts-ignore
      const file = e.target.files[0];

      setMediaContents((prev) => [
        ...prev,
        {
          name: file.name,
          file: file,
        },
      ]);

      const imageString = await converFileToBase64(
        file
      );

      const quill =
        // @ts-ignore
        quillStore.current.getEditor();

      const range = quill.getSelection(true);

      quill.insertEmbed(
        range.index,
        "image",
        imageString
      );

      setTimeout(() => {
        const [leaf] = quill.getLeaf(range.index);

        if (leaf && leaf.domNode) {
          leaf.domNode.alt = file.name;
        }

        handleChange(quill.root.innerHTML);
      }, 0);
    });

    input.click();
  };

  return (
    <div className="w-full mt-[24px]">
      {useMemo(
        () => (
          <ReactQuill
            // @ts-ignore
            className={clsx(
              "w-full bg-white flex flex-col h-[calc(100dvh-400px)] overflow-hidden"
            )}
            // @ts-ignore
            onChange={handleChange}
            theme="snow"
            value={value}
            forwardedRef={(ref) => setQuillRef(ref)}
            modules={{
              toolbar: {
                container: [
                  ["bold", "underline", "italic"],
                  ["image"],
                ],
                handlers: {
                  image: imageHandler,
                },
              },
              ImageResize: {
                parchment: Quill.import("parchment"),
              },
            }}
          />
        ),
        []
      )}
    </div>
  );
};

export default RichTextEditor;
