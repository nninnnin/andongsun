import { atom, useSetRecoilState } from "recoil";
import { pullAt } from "lodash";

import { mediaState } from "@/states";
import { useOverlay } from "@toss/use-overlay";
import SlideMaker from "@/components/admin/SlideMaker";
import { convertFileToBase64 } from "@/utils";
import ReactQuill from "react-quill";
import { MutableRefObject } from "react";

interface Slide {
  name: string;
  file: File;
  source: string;
}

export const slidesState = atom<Array<Slide>>({
  key: "slidesState",
  default: [],
});

const useSlideHandler = (
  quillStore: MutableRefObject<ReactQuill | null>
) => {
  const overlay = useOverlay();

  const setMediaContents =
    useSetRecoilState(mediaState);
  const setSlides = useSetRecoilState(slidesState);

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

      // 1. slides 세팅
      const slides = await Promise.all(
        [...(files ?? [])].map(async (file) => ({
          name: file.name,
          file: file,
          source: await convertFileToBase64(file),
        }))
      );

      setSlides((prev) => [...prev, ...slides]);

      // 2. mediaContents 세팅
      const newMediaContents = [...(files ?? [])].map(
        (file) => ({
          name: file.name,
          file: file,
        })
      );

      setMediaContents((prev) => [
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
                  close();

                  setMediaContents((prev) => {
                    const updated = [...prev];

                    const indexes = slides.reduce(
                      (indexesToRemove, slide) => {
                        const index =
                          updated.findIndex(
                            (media) =>
                              media.name === slide.name
                          );

                        if (index === -1)
                          return indexesToRemove;

                        return [
                          ...indexesToRemove,
                          index,
                        ];
                      },
                      [] as number[]
                    );

                    console.log("지우기 전", updated);
                    console.log(
                      "지울 친구들",
                      indexes
                    );

                    pullAt(updated, indexes);

                    console.log("지운 후", updated);

                    return updated;
                  });

                  setSlides([]);
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
