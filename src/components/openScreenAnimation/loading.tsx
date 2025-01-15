import "./index.scss";

import { Grid } from "antd-mobile";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { env } from "@/config";
import { useTelegram } from "@/providers/telegram";
import { ProjectImage } from "@/util/imageLoader.ts";
import Button from "@/components/button";

import Icon from "../icon";

export default function OpenScreenAnimation({
  status,
  onChange,
  ...props
}: {
  status?: boolean;
  onChange?: (e: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { t } = useTranslation();
  const { webApp } = useTelegram();
  const [showArrow, setShowArrow] = useState(false);

  // 添加按钮位置检测
  useEffect(() => {
    const checkButtonPosition = () => {
      if (status) return;
      const button = document.querySelector(".explore-button");
      const arrow = document.querySelector(".explore-arrow");

      if (button && arrow) {
        const buttonRect = button.getBoundingClientRect();
        const arrowRect = arrow.getBoundingClientRect();

        if (buttonRect.bottom + 46 >= arrowRect.top) {
          setShowArrow(false);
        } else {
          setShowArrow(true);
        }
      }
    };

    checkButtonPosition();
    window.addEventListener("resize", checkButtonPosition);

    return () => {
      window.removeEventListener("resize", checkButtonPosition);
    };
  }, [status]);

  // 处理点击事件
  const handleClick = () => {
    if (status) return;
    onChange?.(true);
  };

  useEffect(() => {
    console.log(webApp, "webApp");
  }, [webApp]);

  return (
    <div {...props} onClick={handleClick} className="h-screen">
      <div className="fixed top-0 left-0 w-full h-full   animated-bg">
        <div className="glow"></div>
        <div className="sparkles"></div>
        <div className="sparkles-extra-1"></div>
        <div className="sparkles-extra-2"></div>
        <div className="sparkles-extra-3"></div>
        <div className="sparkles-extra-4"></div>
        <div className="sparkles-extra-5"></div>
        <div className="scattered-lights"></div>

        <div className="grid justify-items-center w-auto h-full p-4 z-10">
          {webApp?.initDataUnsafe.user &&
          webApp?.initDataUnsafe.user.username ? (
            <Grid
              columns={1}
              gap={24}
              className="justify-items-center text-center h-fit mt-[4em]"
            >
              <Grid.Item className={`${status ? "opacity-100" : "opacity-0"}`}>
                <div className="login">
                  <div className="ui-loader loader-blk">
                    <svg viewBox="22 22 44 44" className="multiColor-loader">
                      <circle
                        cx="44"
                        cy="44"
                        r="20.2"
                        fill="none"
                        strokeWidth="3.6"
                        className="loader-circle loader-circle-animation"
                      ></circle>
                    </svg>
                  </div>
                </div>
              </Grid.Item>

              <Grid.Item className="flex flex-col items-center gap-6">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 mb-8 mx-auto relative z-10 logo-bounce">
                    <ProjectImage
                      path="pics/logo.png"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h1
                    className={`${
                      env === "minidoge"
                        ? "text-[#ffbd09]"
                        : "bg-clip-text text-transparent bg-gradient-to-b from-[--primary-text-color] to-[--primary]"
                    } text-4xl font-bold tracking-wide`}
                  >
                    {t("openScreenAnimation.title")}
                  </h1>
                  <div className="flex flex-col gap-4">
                    <div className="text-lg font-medium text-[--secondary-text-color] opacity-90 italic">
                      {t("openScreenAnimation.text")}
                    </div>
                    <div className="text-base font-normal text-white opacity-80">
                      {t("openScreenAnimation.paratext")}
                    </div>
                  </div>
                </div>
              </Grid.Item>

              <Grid.Item className="flex flex-wrap gap-4 items-center relative z-10">
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = t("openScreenAnimation.telegramUrl").trim();
                    if (!url) return;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <Icon
                    name="telegram"
                    className="!w-12 !h-12 p-2 bg-black/30 rounded-xl border border-[--primary-border-color]"
                  />
                </div>
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = t("openScreenAnimation.twitterUrl").trim();
                    if (url) {
                      window.location.href = url;
                      // window.open(url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <Icon
                    name="twitter"
                    className="!w-12 !h-12 p-2 bg-black/30 rounded-xl border border-[--primary-border-color]"
                  />
                </div>
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = t(
                      "openScreenAnimation.officialWebsiteUrl"
                    ).trim();
                    if (url) {
                      window.open(url);
                    }
                  }}
                >
                  <Icon
                    name="officialWebsite"
                    className="!w-12 !h-12 p-2 bg-black/30 rounded-xl border border-[--primary-border-color]"
                  />
                </div>
              </Grid.Item>

              <Grid.Item className="z-10">
                <Button
                  className="px-8 py-2 font-bold rounded-lg bg-[#ffbd09] text-white explore-button"
                  onClick={() => {}}
                >
                  {t("openScreenAnimation.exploreButton")}
                </Button>
              </Grid.Item>
            </Grid>
          ) : (
            <div className="text-base font-normal opacity-80 mt-12">
              {t("public.settingUserName")}
            </div>
          )}
        </div>

        {webApp?.initDataUnsafe.user.username && !status && (
          <div className="openScreenAnimation absolute bottom-0 w-full pb-4 flex justify-center pointer-events-none">
            <Grid
              columns={1}
              gap={29}
              className="justify-items-center absolute bottom-8"
            >
              <Grid.Item className="explore-arrow">
                <div
                  className={`arrow ${showArrow ? "opacity-100" : "opacity-0"}`}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Grid.Item>
              <Grid.Item className="animate-float">
                {t("openScreenAnimation.hintText")}
              </Grid.Item>
            </Grid>
          </div>
        )}
      </div>
    </div>
  );
}
