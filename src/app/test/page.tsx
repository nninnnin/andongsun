"use client";

import React from "react";

import LinkHandler from "@/components/admin/LinkHandler";

const page = () => {
  return (
    <LinkHandler
      onButtonClick={(input) => {
        console.log(input);
      }}
    />
  );
};

export default page;
