"use client";

import clsx from "clsx";
import React from "react";

import CategorySelect from "@/components/admin/CategorySelect";
import "react-quill/dist/quill.snow.css";
import SubmitButton from "@/components/admin/SubmitButton";
import Credits from "@/components/admin/Credits";
import Editor from "@/components/admin/Editor";
import Thumbnail from "@/components/admin/Thumbnail";
import Caption from "@/components/admin/Caption";
import Title from "@/components/admin/Title";
import ProductionMonth from "@/components/admin/\bProductionMonth";

const AdminPage = () => {
  return (
    <div
      className={clsx(
        "w-[60vw] min-w-[500px] h-full mx-auto",
        "flex flex-col justify-center items-center"
      )}
    >
      <AdminPage.Row>
        <div className="flex justify-between items-center">
          <CategorySelect />
          <ProductionMonth />
          <SubmitButton />
        </div>
      </AdminPage.Row>

      <AdminPage.Row>
        <Thumbnail />
      </AdminPage.Row>

      <AdminPage.Row>
        <Caption />
      </AdminPage.Row>

      <AdminPage.Row>
        <Title />
      </AdminPage.Row>

      <AdminPage.Row>
        <Credits />
      </AdminPage.Row>

      <Editor />
    </div>
  );
};

AdminPage.Row = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "w-full bg-white flex justify-center items-center relative",
        "border-[1px] mt-[-1px] first:mt-0"
      )}
    >
      <div className="w-full">{children}</div>
    </div>
  );
};

export default AdminPage;
