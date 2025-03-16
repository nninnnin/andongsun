import clsx from "clsx";
import React from "react";

import LinkInput from "@/components/admin/LinkHandler/LinkInput";
import Container from "@/components/admin/LinkHandler/Container";
import Preview from "@/components/admin/LinkHandler/Preview";
import ConfirmButton from "@/components/admin/LinkHandler/ConfirmButton";

const LinkHandler = () => {
  return (
    <LinkHandler.Overlay>
      <Container>
        <LinkInput />

        <Preview />

        <ConfirmButton
          handleClick={() => {}}
          inputValidated={false}
        />
      </Container>
    </LinkHandler.Overlay>
  );
};

LinkHandler.Overlay = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "w-[100vw]",
        "h-[100dvh]",
        "fixed top-0 left-0 z-[9999]",
        "bg-black text-white bg-opacity-30",
        "flex justify-center items-center"
      )}
    >
      {children}
    </div>
  );
};

export default LinkHandler;
