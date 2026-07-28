import ReactQuill from "react-quill";
import { MutableRefObject } from "react";
import { useOverlay } from "@toss/use-overlay";
import { atom, useSetRecoilState } from "recoil";

import { slideMediaState } from "@/states";
import { convertFileToBase64 } from "@/utils";
import SlideMaker from "@/components/admin/SlideMaker";
import { hashFile, processFilename } from "@/utils/submit";

export interface Slide {
  hash: string;
  originalName: string;
  file: File;
  source: string;
}

export const slidesState = atom<Array<Slide>>({
  key: "slidesState",
  default: [],
});

export const slideOrderState = atom<Array<string>>({
  key: "slideOrderState",
  default: [],
});

const useSlideHandler = (
  quillStore: MutableRefObject<ReactQuill | null>
) => {
  const overlay = useOverlay();

  const setSlideMediaContents = useSetRecoilState(
    slideMediaState
  );
  const setSlides = useSetRecoilState(slidesState);
  const setSlideOrder = useSetRecoilState(
    slideOrderState
  );

  const slideHandler = (openOverlay = true) => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("multiple", "multiple");

    input.addEventListener("change", async (e) => {
      if (!e.target) return;

      const { files } = e.target as HTMLInputElement;

      if (!files) {
        console.log(
          "There's no files on handling images"
        );

        return;
      }

      // 0. 해시/원본 파일명을 한 번만 계산해서 slides / mediaContents 양쪽에서 동일하게 사용
      const newMediaContents = await Promise.all(
        [...(files ?? [])].map(async (file) => ({
          hash: await hashFile(file),
          originalName: processFilename(file.name),
          file: file,
        }))
      );

      // 1. slides 세팅
      const slides = await Promise.all(
        newMediaContents.map(
          async ({ hash, originalName, file }) => ({
            hash,
            originalName,
            file,
            source: await convertFileToBase64(file),
          })
        )
      );

      setSlides((prev) => [...prev, ...slides]);

      // 2. mediaContents 세팅
      setSlideMediaContents((prev) => [
        ...prev,
        ...newMediaContents,
      ]);

      // 3. overlay 열기 (optional)
      if (openOverlay) {
        overlay.open(({ isOpen, close }) => (
          <>
            {isOpen && (
              <SlideMaker
                quillStore={quillStore}
                closeOverlay={() => {
                  setSlides([]);
                  setSlideOrder([]);

                  close();
                }}
              />
            )}
          </>
        ));
      }
    });

    input.click();
  };

  return {
    slideHandler,
  };
};

export default useSlideHandler;
