import clsx from "clsx";
import React, { ChangeEvent, useRef } from "react";
import { atom, useRecoilState } from "recoil";
import { useOverlay } from "@toss/use-overlay";

import Alert from "@/components/admin/common/Alert";
import { useRouter } from "next/navigation";
import { TOKEN_NAME } from "@/app/login/constants/index";

export const passwordState = atom({
  key: "passwordState",
  default: "",
});

export const isAuthenticatedState = atom({
  key: "isAuthenticatedState",
  default: false,
});

const Password = () => {
  const router = useRouter();

  const [password, setPassword] =
    useRecoilState(passwordState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value);
  };

  const overlay = useOverlay();

  const inputRef = useRef<null | HTMLInputElement>(
    null
  );

  const handleClick = async () => {
    if (!inputRef || !inputRef.current) return;

    inputRef.current.blur();

    if (password === process.env.PASSWORD) {
      const res = await fetch("/login/api");

      const { token } = await res.json();

      localStorage.setItem(TOKEN_NAME, token);

      router.replace("/admin");
    } else {
      overlay.open(({ close, isOpen }) => (
        <Alert
          show={isOpen}
          desc="비밀번호가 틀렸습니다."
          handleConfirm={() => close()}
          handleClose={() => close()}
        />
      ));
    }
  };

  return (
    <div
      className={clsx(
        "bg-[#333333] fixed top-0 left-0",
        "w-screen h-screen",
        "flex items-center justify-center"
      )}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleClick();
        }
      }}
    >
      <div className="flex items-center justify-center">
        <input
          className="input outline-none h-[40px] !mb-0"
          value={password}
          onChange={handleChange}
          ref={inputRef}
          autoFocus
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
