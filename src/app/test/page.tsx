"use client";

import React from "react";
import Spinner from "@/components/admin/common/Spinner";

const page = () => {
  return (
    <Spinner
      contents="업로드 중입니다… ⌛…"
      onMount={() => {}}
    />
  );
};

export default page;
