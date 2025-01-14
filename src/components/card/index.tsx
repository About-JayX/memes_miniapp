import "./index.scss";

import { Card as AntdMobileCard } from "antd-mobile";
const ENV_NAME = import.meta.env.MODE.split("-")[1];

export default function Card({
  animation = true,
  className = "",
  type = "default",
  ...props
}: {
  children?: React.ReactNode;
  animation?: boolean;
  className?: string;
  type?: "default" | "primary";
}) {
  const styles: any = {
    memes: {
      card: `relative !bg-[--primary-card-body-color] !rounded-xl !p-[2px] border border-[--primary-border-color] card ${
        animation ? "card-animation" : ""
      }`,
    },
    minidoge: {
      card:
        type === "primary"
          ? `!bg-gradient-to-b !from-[--primary] !to-[#ffae00] !text-black`
          : "!bg-[--primary-card-body-color]",
    },
    mego: {
      card: `${
        type === "primary"
          ? `!bg-gradient-to-b !from-[#00AB5E] !to-[#2C2A62]`
          : "!bg-[--primary-card-body-color]"
      }`,
    },
  };
  return (
    <div
      className={`bg-transparent ${
        ENV_NAME === "memes" ? "memes-card" : ""
      } ${className}`}
    >
      <AntdMobileCard
        className={`
        ${styles[ENV_NAME].card}`}
      >
        <div
          className={`${
            ENV_NAME === "memes"
              ? "bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] !px-3 !py-2 !rounded-[10px] "
              : ""
          }`}
        >
          {props.children}
        </div>
      </AntdMobileCard>
    </div>
  );
}
