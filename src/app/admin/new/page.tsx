"use client";

import dynamic from "next/dynamic";
import React from "react";

const NewArticlePage = () => {
  const Editor = dynamic(
    () => import("@/components/admin/Editor"),
    {
      ssr: false,
    }
  );

  return <Editor />;
};

export default NewArticlePage;
