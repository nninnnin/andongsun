import { useSetRecoilState } from "recoil";

import { mediaState } from "@/states";
import { useOverlay } from "@toss/use-overlay";
import SlideMaker from "@/components/admin/SlideMaker";

const useSlideHandler = () => {
  const overlay = useOverlay();

  const setMediaContents =
    useSetRecoilState(mediaState);

  const slideHandler = () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("multiple", "multiple");

    input.addEventListener("change", (e) => {
      if (!e.target) return;

      const { files } = e.target as HTMLInputElement;

      if (!files) {
        console.log(
          "There's no files on handling images"
        );

        return;
      }

      const newMediaContents = [...(files ?? [])].map(
        (file) => ({
          name: file.name,
          file: file,
        })
      );

      console.log(
        "new media contents",
        newMediaContents
      );

      setMediaContents((prev) => [
        ...prev,
        ...newMediaContents,
      ]);

      overlay.open(() => (
        <SlideMaker images={files} />
      ));
    });

    input.click();
  };

  return {
    slideHandler,
  };
};

export default useSlideHandler;
