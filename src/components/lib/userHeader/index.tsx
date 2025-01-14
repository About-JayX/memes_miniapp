import { Image } from "antd-mobile";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import MButton from "@/components/button";
import Icon from "@/components/icon";
import { useAppSelector } from "@/store";
import { getTextColorForBackground } from "@/util";

import Lang from "./lang";
import Profile from "./profile";
const isMemes = import.meta.env.MODE.split("-")[1] === "memes";

export const UserIcon = ({
  children,
  onClick,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <MButton
      className={`${isMemes ? "" : "!rounded-full"} ${className}`}
      onClick={onClick}
    >
      {children}
    </MButton>
  );
};

export default function UserHeader() {
  const { user } = useAppSelector((state) => state.telegram);
  const [langStatus, setLangStatus] = useState<boolean>(false);
  const [profileStatus, setProfileStatus] = useState<boolean>(false);
  const { t } = useTranslation();
  const { backgroundColor, textColor } = getTextColorForBackground(
    user.username
  );
  return (
    <>
      <Lang open={langStatus} onClose={() => setLangStatus(false)} />
      <Profile open={profileStatus} onClose={() => setProfileStatus(false)} />
      <div className="flex h-[40px] mt-4 items-center gap-2 justify-between">
        <div className="flex-1" />
        {/* 电报 */}
        <UserIcon
          onClick={() => {
            window.open(t("openScreenAnimation.telegramUrl"));
          }}
        >
          <Icon name="telegram" />
        </UserIcon>
        {/* 推特 */}
        <UserIcon
          onClick={() => {
            window.open(t("openScreenAnimation.twitterUrl"));
          }}
        >
          <Icon name="twitter" />
        </UserIcon>

        {/* 语言 */}
        <UserIcon
          onClick={() => setLangStatus(true)}
          className="!p-1 !pr-2  w-auto text-sm"
        >
          <Icon
            name="lang"
            className="bg-[--primary] rounded-full w-[30px] h-[30px] p-[6px]"
          />
          &nbsp;&nbsp;{t("lang")}
        </UserIcon>
        <a onClick={() => setProfileStatus(true)}>
          {user.avatar_url ? (
            <Image
              className="!w-[40px] !h-[40px] rounded-full text-base font-medium flex items-center justify-center"
              src={user.avatar_url}
            />
          ) : (
            <div
              className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-base font-medium`}
              style={{ background: backgroundColor, color: textColor }}
            >
              {user.username.slice(0, 2).toLocaleUpperCase()}
            </div>
          )}
        </a>
      </div>
    </>
  );
}
