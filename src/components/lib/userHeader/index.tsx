import { Image } from "antd-mobile";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import MButton from "@/components/button";
import Icon from "@/components/icon";
import { useAppSelector } from "@/store";
import { getTextColorForBackground } from "@/util";

import Lang from "./lang";
import Profile from "./profile";
import SearchContainer, {
  SearchContainerProps,
} from "@/view/index/components/search";
import Search from "@/components/search";
import { useNavigate } from "react-router";
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

export const UserHeaderLangBox = ({ loading }: { loading?: boolean }) => {
  const { t } = useTranslation();
  const [langStatus, setLangStatus] = useState<boolean>(false);
  return (
    <>
      <Lang open={langStatus} onClose={() => setLangStatus(false)} loading={loading}/>
      <UserIcon
        onClick={() => setLangStatus(true)}
        className="!p-1 !pr-2  w-auto text-sm z-10"
      >
        <Icon
          name="lang"
          className="bg-[--primary] rounded-full w-[30px] h-[30px] p-[6px]"
        />
        &nbsp;&nbsp;{t("lang")}
      </UserIcon>
    </>
  );
};

export default function UserHeader({
  viewStatus,
  bodyHeight,
  // onSearchStatus,
  onSearchLoadStatus,
  onVoteSelect,
}: SearchContainerProps) {
  const { user } = useAppSelector((state) => state.telegram);

  const [profileStatus, setProfileStatus] = useState<boolean>(false);
  const { t } = useTranslation();
  const { backgroundColor, textColor } = getTextColorForBackground(
    user.username
  );
  const navigate = useNavigate();
  return (
    <>
      <Profile open={profileStatus} onClose={() => setProfileStatus(false)} />
      <div className="flex h-[40px] mt-4 items-center gap-2 justify-between">
        {/* <SearchContainer
          viewStatus={viewStatus}
          bodyHeight={bodyHeight}
          onSearchStatus={()=>{}}
          onSearchLoadStatus={onSearchLoadStatus}
          onVoteSelect={onVoteSelect}
        /> */}
        <div className="flex-1" onClick={() => navigate("/search")}>
          <Search
            // viewStatus={viewStatus}
            placeholder="public.search"
            // bodyHeight={bodyHeight}
            // onSearchStatus={()=>{}}
            // onSearchLoadStatus={onSearchLoadStatus}
            // onVoteSelect={onVoteSelect}
          />
        </div>

        {/* <div className="flex-1" /> */}
        {/* 电报 */}
        <UserIcon
          onClick={() => {
            window.open(
              t("openScreenAnimation.telegramUrl"),
              "_blank",
              "noopener,noreferrer"
            );
          }}
        >
          <Icon name="telegram" />
        </UserIcon>
        {/* 推特 */}
        <UserIcon
          onClick={() => {
            const url = t("openScreenAnimation.twitterUrl");
            if (url) {
              window.location.href = url;
            }
          }}
        >
          <Icon name="twitter" />
        </UserIcon>

        {/* 语言 */}
        <UserHeaderLangBox />
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
