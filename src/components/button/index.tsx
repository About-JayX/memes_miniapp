import "./index.scss";

import { Fragment } from "react";
const isMemes = import.meta.env.MODE === "dev-memes";
export default function Button({
  animation = true,
  className = "",
  ...props
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  animation?: boolean;
}) {
  return (
    <a
      id="memes-button-icon"
      className={`relative text-current font-bold ${isMemes?"":"!bg-white/5"} ${className} `}
      {...props}
    >
      {isMemes ? (
        <Fragment>
          {animation && <div className="filterBorder" />}
          {animation && <div className="filterBg" />}
        </Fragment>
      ) : (
        ""
      )}

      {props.children}
    </a>
  );
}
