import clsx from "clsx";
import React, { ChangeEvent, useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { useOverlay } from "@toss/use-overlay";
import Alert from "@/components/admin/common/Alert";

export const passwordState = atom({
  key: "passwordState",
  default: "",
});

export const isAuthenticatedState = atom({
  key: "isAuthenticatedState",
  default: false,
});

const Password = () => {
  const [password, setPassword] =
    useRecoilState(passwordState);

  const [isAuthenticated, setIsAuthenticated] =
    useRecoilState(isAuthenticatedState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value);
  };

  useEffect(() => {}, []);

  const overlay = useOverlay();

  const handleClick = () => {
    if (password === process.env.PASSWORD) {
      setIsAuthenticated(true);

      return;
    }

    overlay.open(({ close, isOpen }) => (
      <Alert
        show={isOpen}
        desc="비밀번호가 틀렸습니다."
        handleConfirm={() => close()}
        handleClose={() => close()}
      />
    ));
  };

  return (
    <div
      className={clsx(
        "bg-[#222222] fixed top-0 left-0",
        "w-screen h-screen",
        "flex items-center justify-center"
      )}
    >
      <div className="flex items-center justify-center">
        <input
          className="input outline-none h-[40px] !mb-0"
          value={password}
          onChange={handleChange}
        />

        <button
          className="bg-themeBlue text-white p-3 py-2 ml-3"
          onClick={handleClick}
        >
          들어가기
        </button>
      </div>
    </div>
  );
};

export default Password;
