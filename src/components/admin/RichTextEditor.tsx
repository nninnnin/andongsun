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
import { atom, useSetRecoilState } from "recoil";

const BaseImageFormat = Quill.import("formats/image");
const ImageFormatAttributesList = [
  "alt",
  "height",
  "width",
  "style",
];

class ImageFormat extends BaseImageFormat {
  domNode: any;

  // @ts-ignore
  static formats(domNode) {
    // tslint:disable-next-line: only-arrow-functions
    return ImageFormatAttributesList.reduce(function (
      formats,
      attribute
    ) {
      if (domNode.hasAttribute(attribute)) {
        // @ts-ignore
        formats[attribute] =
          domNode.getAttribute(attribute);
      }
      return formats;
    },
    {});
  }
  // @ts-ignore
  format(name, value) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

// @ts-ignore
import ImageResize from "quill-image-resize";
Quill.register("modules/ImageResize", ImageResize);
Quill.register(ImageFormat, true);
import "react-quill/dist/quill.snow.css";

import useArticle from "@/hooks/useArticle";
import { mediaState } from "@/states";
import { convertFileToBase64 } from "@/utils/index";
import { usePathname } from "next/navigation";
import sanitize from "sanitize-filename";
import useImageHandler from "@/hooks/useImageHandler";

export const richEditorLoadedState = atom({
  key: "richEditorLoadedState",
  default: false,
});

const RichTextEditor = () => {
  const pathname = usePathname();

  const isEditing = pathname.includes("edit");

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
      }) => {
        return <RQ ref={forwardedRef} {...props} />;
      };
    },
    {
      ssr: false,
      loading: () => (
        <RichTextEditor.LoadingPlaceholder
          hasContents={isEditing}
        />
      ),
    }
  );

  const [quillRef, setQuillRef] =
    useState<ReactQuill | null>(null);

  const quillStore = useRef<ReactQuill | null>(null);

  useEffect(() => {
    if (!quillRef) return;

    if (!quillRef.value) {
      quillRef
        .getEditor()
        .clipboard.dangerouslyPasteHTML(value);

      quillRef.getEditor().on("editor-change", () => {
        handleChange(
          quillRef.getEditor().root.innerHTML
        );
      });

      quillRef
        .getEditor()
        .root.addEventListener("click", (e) => {
          // @ts-ignore
          if (e.target.tagName === "IMG") {
            console.log("image clicked");
          }
        });
    }
  }, [quillRef, value]);

  const { imageHandler } = useImageHandler(quillStore);

  return (
    <div className="w-full h-full">
      {useMemo(
        () => (
          <ReactQuill
            // @ts-ignore
            className={clsx(
              "w-full h-full bg-white flex flex-col h-full overflow-hidden"
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
