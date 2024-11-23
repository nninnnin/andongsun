import { v4 as uuid } from "uuid";
import clsx from "clsx";
import React, {
  MouseEvent,
  useEffect,
  useMemo,
} from "react";
import { Sortable } from "@shopify/draggable";

import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { lastIndexOf, pullAt } from "lodash";

import { slideMediaState } from "@/states";
import useSlideHandler, {
  slideOrderState,
  slidesState,
} from "@/hooks/useSlideHandler";

import ReactQuill, { Quill } from "react-quill";

const BlockEmbed = Quill.import("blots/block/embed");

class SlideBlot extends BlockEmbed {
  static blotName = "slide";
  static tagName = "div";
  static className = "swiper-container";

  static create(value: {
    images: Array<{
      src: string;
      alt: string;
    }>;
  }) {
    const node = super.create();

    const swiper = document.createElement("div");
    swiper.classList.add("swiper");

    node.addEventListener(
      "dragover",
      (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }
    );

    const swiperWrapper =
      document.createElement("div");
    swiperWrapper.classList.add("swiper-wrapper");

    console.log("value", value);

    if (value.images && value.images.length) {
      const { images } = value;

      images.forEach(({ src, alt }) => {
        const img = document.createElement("img");

        img.setAttribute("src", src);
        img.setAttribute("alt", alt);

        const swiperSlide =
          document.createElement("li");
        swiperSlide.classList.add("swiper-slide");
        swiperSlide.appendChild(img);

        swiperWrapper.appendChild(swiperSlide);
      });
    }

    swiper.appendChild(swiperWrapper);
    node.appendChild(swiper);

    const nextButton =
      document.createElement("button");
    nextButton.classList.add("swiper-button-next");

    const prevButton =
      document.createElement("button");
    prevButton.classList.add("swiper-button-prev");

    node.appendChild(nextButton);
    node.appendChild(prevButton);

    setTimeout(() => {
      const swipers =
        document.querySelectorAll(".swiper");

      swipers.forEach((swiper) => {
        const images = swiper.querySelectorAll("img");

        if (images) {
          images.forEach((image) => {
            if (image.complete) {
              image.classList.add("show-image");
            } else {
              image.onload = () =>
                image.classList.add("show-image");
            }
          });
        }

        // @ts-ignore
        new Swiper(swiper, {
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
        });
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
    const images = node.querySelectorAll("img");

    return {
      images: Array.from(images).map((img) => ({
        src: img.getAttribute("src") || "",
        alt: img.getAttribute("alt") || "",
      })),
    };
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
        <SlideMaker.Header quillStore={quillStore} />

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

SlideMaker.Header = ({
  quillStore,
}: {
  quillStore: React.MutableRefObject<ReactQuill | null>;
}) => {
  const { slideHandler } = useSlideHandler(quillStore);

  const handleAddButtonClick = () => {
    slideHandler(false);
  };

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
        onClick={handleAddButtonClick}
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
        "fixed top-0 left-0 z-[9999]",
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

  const [slideOrder, setSlideOrder] = useRecoilState(
    slideOrderState
  );

  const setSlideMediaContents = useSetRecoilState(
    slideMediaState
  );

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

  useEffect(() => {
    setSlideOrder(slides.map((slide) => slide.name));
  }, [slides]);

  useEffect(() => {
    const container = document.querySelector(
      ".slide-image-container"
    );

    const sortable = new Sortable(
      container as HTMLElement,
      {
        draggable: ".dragable",
      }
    );

    sortable.on("drag:start", (e) => {
      if (!e.originalEvent.target) return;

      (
        e.originalEvent.target as HTMLElement
      ).classList.contains("remove-button") &&
        e.cancel();
    });

    sortable.on("sortable:stop", () => {
      const container = document.querySelector(
        ".slide-image-container"
      );

      console.log("start");

      setTimeout(() => {
        const sorted = [
          ...(container?.childNodes ?? []),
        ] as Array<HTMLElement>;

        const filtered = sorted
          .map((el) =>
            el
              .querySelector("img")
              ?.getAttribute("alt")
          )
          .filter((el) => el) as string[];

        setSlideOrder(filtered);
      }, 0);
    });
  }, []);

  const handleRemoveButtonClick =
    (filename: string) => (e: MouseEvent) => {
      e.stopPropagation();

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

      setSlideMediaContents((prev) => {
        const fileIndex = lastIndexOf(
          prev.map((el) => el.name),
          filename
        );

        if (fileIndex === -1) return prev;

        const removed = [...prev];

        pullAt(removed, [fileIndex]);

        return removed;
      });
    };

  return (
    <div
      className={clsx(
        "slide-image-container",
        "w-[calc(calc(120px*5)+calc(14px*4))]",
        "flex flex-wrap justify-center items-center gap-[14px]",
        "mx-auto mt-[40px] mb-[46px]"
      )}
    >
      {fixedLengthImages.map((image) => {
        return (
          <div
            id={
              image.src ? "slide-image" : "slide-empty"
            }
            className={clsx(
              "slide-image-wrapper",
              "w-[120px] h-[120px] relative overflow-hidden",
              "select-none",
              image.src
                ? "slide-image-shadow dragable"
                : "bg-[#d9d9d9]"
            )}
            key={image.id}
            data-key={image.id}
          >
            {image.src && (
              <img
                className={clsx(
                  "w-full h-full",
                  "object-contain"
                )}
                src={image.src}
                alt={image.name}
              />
            )}

            {image.src && (
              <button
                className={clsx(
                  "remove-button",
                  "w-[22px] h-[22px]",
                  "flex justify-center items-center",
                  "bg-themeBlue",
                  "absolute top-0 right-0 z-[100]",
                  "border-[1px] border-solid border-white"
                )}
                onClick={handleRemoveButtonClick(
                  image.name
                )}
              >
                <img
                  className="remove-button w-[11px] h-[11px]"
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
  const [slides, setSlides] =
    useRecoilState(slidesState);
  const [slideOrder, setSlideOrder] = useRecoilState(
    slideOrderState
  );
  const setSlideMediaContents = useSetRecoilState(
    slideMediaState
  );

  const slideMediaContents = useRecoilValue(
    slideMediaState
  );

  const handleSaveButtonClick = () => {
    const range = quillRef?.getEditor().getSelection();

    if (range) {
      const editor = quillRef?.getEditor();

      const images = slides.map((slide) => ({
        src: slide.source,
        alt: slide.name,
      }));

      const orderedImages = slideOrder.map(
        (slideName) => {
          return images.find(
            (image) => image.alt === slideName
          );
        }
      );

      console.log("1. 슬라이드 상태", slides);
      console.log(
        "2. 정렬된 슬라이드 상태",
        slideOrder
      );
      console.log(
        "3. 슬라이드 미디어 컨텐츠",
        slideMediaContents
      );

      editor?.insertEmbed(range.index, "slide", {
        images: orderedImages,
      });
    }

    closeOverlay();
  };

  const handleCancelButtonClick = () => {
    // 슬라이드 생성을 취소했을 때, mediaContents에서도 지워준다.
    console.log("지워지기 전", slideMediaContents);

    setSlideMediaContents((mediaContents) => {
      const removingIndexes = slides.reduce(
        (removingIndexes, slide) => {
          const index = lastIndexOf(
            mediaContents.map((el) => el.name),
            slide.name
          );

          if (index === -1) return removingIndexes;

          return [...removingIndexes, index];
        },
        [] as number[]
      );

      if (!removingIndexes.length)
        return mediaContents;

      const newMediaContents = [...mediaContents];

      pullAt(newMediaContents, removingIndexes);

      console.log("지워진 후", newMediaContents);

      return newMediaContents;
    });

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
