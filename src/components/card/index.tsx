import "./index.scss";

import { Card as AntdMobileCard } from "antd-mobile";
export default function Card({
  animation = true,
  ...props
}: {
  children?: React.ReactNode;
  animation?: boolean;
}) {
  return (
    <div className="memes-card">
      <AntdMobileCard
        className={`relative !bg-[--primary-card-body-color] !rounded-xl !p-[2px] border border-[--primary-border-color] card ${
          animation ? "card-animation" : ""
        }`}
      >
        <div className="bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] !px-3 !py-2 !rounded-[10px] ">
          {props.children}
        </div>
      </AntdMobileCard>
    </div>
  );
}
