import "./index.scss";
import { Card as AntdMobileCard } from "antd-mobile";

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
  const ENV_NAME = import.meta.env.MODE.split('-')[1]
  
  const cardClass = type === "primary"
    ? "!bg-gradient-to-b !from-[var(--primary)] !to-[var(--card-gradient-end)] !text-[var(--card-text)]"
    : "!bg-[var(--primary-card-body-color)]"

  return (
    <div className={`bg-transparent ${ENV_NAME === "memes" ? "memes-card" : ""} ${className}`}>
      <AntdMobileCard
        className={`!rounded-[var(--card-border-radius)] ${cardClass}`}
      >
        <div
          className={`${
            ENV_NAME === "memes"
              ? "bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] !px-3 !py-2 !rounded-[10px]"
              : ""
          }`}
        >
          {props.children}
        </div>
      </AntdMobileCard>
    </div>
  );
}
