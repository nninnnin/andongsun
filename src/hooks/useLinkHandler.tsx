import ReactQuill from "react-quill";
import { createPortal } from "react-dom";
import { useOverlay } from "@toss/use-overlay";
import React, { MutableRefObject } from "react";

import LinkHandler from "@/components/admin/LinkHandler";

const useLinkHandler = (
  quillStore: MutableRefObject<ReactQuill | null>
) => {
  const overlay = useOverlay();

  const linkHandler = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <>
          {isOpen &&
            createPortal(
              <LinkHandler />,
              document.body
            )}
        </>
      );
    });
  };

  return {
    linkHandler,
  };
};

export default useLinkHandler;
