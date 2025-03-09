import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { TOKEN_NAME } from "@/app/login/constants/index";

const withAuth =
  <Props extends object>(Wrapped: React.FC<Props>) =>
  (props: Props) => {
    const router = useRouter();

    const [authenticated, setAuthenticated] =
      useState(false);

    useEffect(() => {
      (async function () {
        const token = localStorage.getItem(TOKEN_NAME);

        const res = await fetch("/login/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const { isValid } = await res.json();

        if (!isValid) {
          router.replace("/login");
        } else {
          setAuthenticated(true);
          router.replace("/admin");
        }
      })();
    }, []);

    if (!authenticated) {
      return <Loading />;
    }

    return <Wrapped {...props} />;
  };

const Loading = () => {
  return (
    <div className="w-[100vw] h-[100dvh] flex items-center justify-center text-white bg-[#333333]">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {"사용자 정보를 확인하는 중입니다.."}
      </motion.span>
    </div>
  );
};

export default withAuth;
