import { useSetRecoilState } from "recoil";
import sanitize from "sanitize-filename";

import useArticle from "@/hooks/useArticle";
import { mediaState } from "@/states";
import {
  convertFileToBase64,
  iterateListNode,
} from "@/utils";
import ReactQuill from "react-quill";
import { MutableRefObject } from "react";
import { reverse } from "lodash";
import { processFilename } from "@/utils/submit";

const useImageHandler = (
  quillStore: MutableRefObject<ReactQuill | null>
) => {
  const setMediaContents =
    useSetRecoilState(mediaState);

  const { handleChange: handleArticleContentsChange } =
    useArticle<string>("contents");

  const imageHandler = () => {
    // 1. 인풋 생성
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("multiple", "multiple");
    input.setAttribute(
      "accept",
      "image/png, image/jpeg, image/jpg"
    );

    // 2. 인풋 체인지 핸들러
    input.addEventListener("change", async (e) => {
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
          name: processFilename(file.name),
          file: file,
        })
      );

      // 1. 상태로 설정 (Submission에 업로드 시 활용)
      setMediaContents((prev) => [
        ...prev,
        ...newMediaContents,
      ]);

      // 이미지 스트링으로 바꾸는 이유는 업로드 전, 에디팅 텍스트로 추가해주어 화면에서 확인할 수 있도록 하기 위함
      const newImagesAsString = await Promise.all(
        [...(files ?? [])].map(
          async (file) =>
            await convertFileToBase64(file)
        )
      );

      console.log(
        "new images as string",
        newImagesAsString
      );

      const quill = quillStore.current?.getEditor();

      if (!quill) {
        console.log("Has no quill instance");

        return;
      }

      const range = quill.getSelection(true);

      reverse(newImagesAsString).forEach(
        (imageString) => {
          quill.insertEmbed(
            range.index,
            "image",
            imageString
          );
        }
      );

      setTimeout(() => {
        const [line] = quill.getLine(range.index);

        iterateListNode(
          line.children.head,
          (domNode, index) => {
            const fileName = files[index].name;
            domNode.alt = processFilename(fileName);
          }
        );

        handleArticleContentsChange(
          quill.root.innerHTML
        );
      }, 0);
    });

    input.click();
  };

  return {
    imageHandler,
  };
};

export default useImageHandler;
