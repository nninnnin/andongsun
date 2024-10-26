import { v4 as uuid } from "uuid";
import clsx from "clsx";
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { convertFileToBase64 } from "@/utils";

const SlideMaker = ({
  images,
}: {
  images: FileList;
}) => {
  const [imageStrings, setImageStrings] = useState<
    string[]
  >([]);

  useEffect(() => {
    (async function () {
      const imageStrings = await Promise.all(
        [...(images ?? [])].map(
          async (file) =>
            await convertFileToBase64(file)
        )
      );

      setImageStrings(imageStrings);
    })();
  }, [images]);

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

          <SlideMaker.Images
            imageStrings={imageStrings}
          />
        </div>

        <SlideMaker.Buttons />
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
  return (
    <h1
      className={clsx(
        "px-[15px] py-[10px] font-medium text-[16px]",
        "flex justify-between items-center",
        "border-[1px] border-themeBlue"
      )}
    >
      <span className="text-themeBlue">Slides</span>

      <img src="/button--add-image.svg" />
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

SlideMaker.Images = ({
  imageStrings,
}: {
  imageStrings: string[];
}) => {
  const fixedLengthImages = useMemo(() => {
    const fixedLengthImages = [] as Array<{
      id: string;
      src: string;
    }>;

    Array.from({ length: 10 }).forEach((_, index) => {
      if (!imageStrings[index]) {
        fixedLengthImages[index] = {
          id: uuid(),
          src: "",
        };
      } else {
        fixedLengthImages[index] = {
          id: uuid(),
          src: imageStrings[index],
        };
      }
    });

    return fixedLengthImages;
  }, [imageStrings]);

  console.log(fixedLengthImages);

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
              "w-[120px] h-[120px] relative",
              image.src
                ? "slide-image-shadow"
                : "bg-[#d9d9d9]"
            )}
            key={image.id}
          >
            {image.src && (
              <img
                className={"w-full h-full"}
                src={image.src}
              />
            )}

            <button
              className={clsx(
                "w-[22px] h-[22px]",
                "flex justify-center items-center",
                "bg-themeBlue",
                "absolute top-0 right-0",
                "border-[1px] border-solid border-white"
              )}
            >
              <img
                className="w-[11px] h-[11px]"
                src="/remove.svg"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};

SlideMaker.Buttons = () => {
  return (
    <div className="flex">
      <SlideMaker.Button
        className={clsx("bg-themeBlue text-white")}
      >
        확인
      </SlideMaker.Button>

      <SlideMaker.Button
        className={clsx(
          "bg-[#333333] text-white",
          "border-l-0"
        )}
      >
        취소
      </SlideMaker.Button>
    </div>
  );
};

SlideMaker.Button = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <button
      className={clsx(
        "py-[8px]",
        "flex-1",
        "text-[16px] font-medium",
        "flex justify-center items-center",
        "border-[1px] border-solid border-t-0 border-white",
        className
      )}
    >
      {children}
    </button>
  );
};

export default SlideMaker;
