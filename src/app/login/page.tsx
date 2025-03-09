"use client";

import React from "react";
import Password from "@/components/admin/Login";
import { OverlayProvider } from "@toss/use-overlay";

const LoginPage = () => {
  return (
    <OverlayProvider>
      <Password />
    </OverlayProvider>
  );
};

export default LoginPage;
