import { v4 as uuid } from "uuid";
import clsx from "clsx";
import React, { useMemo } from "react";
import Glide from "@glidejs/glide";

import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { lastIndexOf, pullAt, remove } from "lodash";

import { mediaState } from "@/states";
import { slidesState } from "@/hooks/useSlideHandler";

import ReactQuill, { Quill } from "react-quill";

const BlockEmbed = Quill.import("blots/block/embed");

class SlideBlot extends BlockEmbed {
  static blotName = "slide";
  static tagName = "div";
  static className = "ql-slide";

  static create(value: {
    images: Array<{
      src: string;
      alt: string;
    }>;
  }) {
    const node = super.create();

    node.classList.add("glide");

    node.addEventListener(
      "dragover",
      (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }
    );

    const glideTrack = document.createElement("div");
    glideTrack.setAttribute("data-glide-el", "track");
    glideTrack.classList.add("glide__track");

    const glideSlides = document.createElement("ul");
    glideSlides.classList.add("glide__slides");

    if (value.images && value.images.length) {
      const { images } = value;

      images.forEach(({ src, alt }) => {
        const img = document.createElement("img");

        img.setAttribute("src", src);
        img.setAttribute("alt", alt);
        img.classList.add("slide-image");

        const glideSlide =
          document.createElement("li");
        glideSlide.classList.add("glide__slide");
        glideSlide.appendChild(img);
        glideSlides.appendChild(glideSlide);
      });
    }

    glideTrack.appendChild(glideSlides);
    node.appendChild(glideTrack);

    setTimeout(() => {
      const glides =
        document.querySelectorAll(".glide");

      glides.forEach((glide) => {
        new Glide(glide as HTMLElement, {
          rewind: false,
        }).mount();
      });
    }, 0);

    return node;
  }

  static formats(node: HTMLElement) {
    const images = node.dataset.images
      ? JSON.parse(node.dataset.images)
      : [];
    return {
      images: images,
    };
  }

  static value(node: HTMLElement) {
    const images = node.querySelectorAll(
      ".slide-image"
    );

    return Array.from(images).map((img) => ({
      src: img.getAttribute("src") || "",
      alt: img.getAttribute("alt") || "",
    }));
  }
}

Quill.register(SlideBlot);

export const imageStringsState = atom<
  Array<{
    name: string;
    source: string;
  }>
>({
  key: "imageStringsState",
  default: [],
});

const SlideMaker = ({
  quillStore,
  closeOverlay,
}: {
  quillStore: React.MutableRefObject<ReactQuill | null>;
  closeOverlay: () => void;
}) => {
  return (
    <SlideMaker.Overlay>
      <SlideMaker.Container>
        <SlideMaker.Header />

        <div
          className={clsx(
            "p-[15px] flex flex-col items-center",
            "border-l-[1px] border-r-[1px]",
            "border-themeBlue"
          )}
        >
          <p
            className={clsx(
              "w-full text-[12px] text-themeBlue"
            )}
          >
            드래그해서 이미지 순서를 조정할 수
            있습니다. 이미지를 추가하시려면 + 버튼을
            누르세요.<b>(최대 10장)</b>
          </p>

          <SlideMaker.Images />
        </div>

        <SlideMaker.Buttons
          quillStore={quillStore}
          closeOverlay={closeOverlay}
        />
      </SlideMaker.Container>
    </SlideMaker.Overlay>
  );
};

SlideMaker.Container = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={clsx("bg-white w-[750px]")}>
      {children}
    </div>
  );
};

SlideMaker.Header = () => {
  // const { slideHandler } = useSlideHandler();

  // const handleAddButtonClick = () => {
  //   slideHandler(false);
  // };

  return (
    <h1
      className={clsx(
        "px-[15px] py-[10px] font-medium text-[16px]",
        "flex justify-between items-center",
        "border-[1px] border-themeBlue"
      )}
    >
      <span className="text-themeBlue">Slides</span>

      <img
        src="/button--add-image.svg"
        // onClick={handleAddButtonClick}
      />
    </h1>
  );
};

SlideMaker.Overlay = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "w-screen h-screen bg-[#333333] bg-opacity-50",
        "fixed top-0 left-0",
        "flex justify-center items-center",
        "p-10"
      )}
    >
      {children}
    </div>
  );
};

SlideMaker.Images = () => {
  const [slides, setSlides] =
    useRecoilState(slidesState);

  const setMediaContents =
    useSetRecoilState(mediaState);

  const mediaContents = useRecoilValue(mediaState);

  const fixedLengthImages = useMemo(() => {
    const fixedLengthImages = [] as Array<{
      id: string;
      name: string;
      src: string;
    }>;

    Array.from({ length: 10 }).forEach((_, index) => {
      if (!slides[index]) {
        fixedLengthImages[index] = {
          id: uuid(),
          name: "",
          src: "",
        };
      } else {
        fixedLengthImages[index] = {
          id: uuid(),
          name: slides[index].name,
          src: slides[index].source,
        };
      }
    });

    return fixedLengthImages;
  }, [slides]);

  const handleRemoveButtonClick =
    (filename: string) => () => {
      setSlides((prev) => {
        const fileIndex = lastIndexOf(
          prev.map((el) => el.name),
          filename
        );

        if (fileIndex === -1) return prev;

        const updated = [...prev];

        pullAt(updated, [fileIndex]);

        return updated;
      });

      // mediaContents 상태에서도 지워준다
      setMediaContents((prev) => {
        const fileIndex = prev.findIndex(
          (media) => media.name === filename
        );

        if (fileIndex === -1) return prev;

        const updated = [...prev];

        remove(
          updated,
          (media) => media.name === filename
        );

        return updated;
      });
    };

  return (
    <div
      className={clsx(
        "w-[calc(calc(120px*5)+calc(14px*4))]",
        "flex flex-wrap justify-center items-center gap-[14px]",
        "mx-auto mt-[40px] mb-[46px]"
      )}
    >
      {fixedLengthImages.map((image) => {
        return (
          <div
            className={clsx(
              "w-[120px] h-[120px] relative overflow-hidden",
              image.src
                ? "slide-image-shadow"
                : "bg-[#d9d9d9]"
            )}
            key={image.id}
          >
            {image.src && (
              <img
                className={clsx(
                  "w-full h-full",
                  "object-contain"
                )}
                src={image.src}
              />
            )}

            {image.src && (
              <button
                className={clsx(
                  "w-[22px] h-[22px]",
                  "flex justify-center items-center",
                  "bg-themeBlue",
                  "absolute top-0 right-0",
                  "border-[1px] border-solid border-white"
                )}
                onClick={handleRemoveButtonClick(
                  image.name
                )}
              >
                <img
                  className="w-[11px] h-[11px]"
                  src="/remove.svg"
                />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

SlideMaker.Buttons = ({
  quillStore,
  closeOverlay,
}: {
  quillStore: React.MutableRefObject<ReactQuill | null>;
  closeOverlay: () => void;
}) => {
  const quillRef = quillStore.current;
  const slides = useRecoilValue(slidesState);

  const handleSaveButtonClick = () => {
    const range = quillRef?.getEditor().getSelection();

    if (range) {
      const editor = quillRef?.getEditor();

      const images = slides.map((slide) => ({
        src: slide.source,
        alt: slide.name,
      }));

      editor?.insertEmbed(range.index, "slide", {
        images,
      });
    }

    closeOverlay();
  };

  const handleCancelButtonClick = () => {
    closeOverlay();
  };

  return (
    <div className="flex">
      <SlideMaker.Button
        className={clsx("bg-themeBlue text-white")}
        onClick={handleSaveButtonClick}
      >
        확인
      </SlideMaker.Button>

      <SlideMaker.Button
        className={clsx(
          "bg-[#333333] text-white",
          "border-l-0"
        )}
        onClick={handleCancelButtonClick}
      >
        취소
      </SlideMaker.Button>
    </div>
  );
};

SlideMaker.Button = ({
  className = "",
  children,
  onClick = () => {},
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      className={clsx(
        "py-[8px]",
        "flex-1",
        "text-[16px] font-medium",
        "flex justify-center items-center",
        "border-[1px] border-solid border-t-0 border-white",
        "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SlideMaker;
