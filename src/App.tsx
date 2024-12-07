import { useBackButtonRaw } from "@telegram-apps/sdk-react";
import { ConfigProvider, TabBar } from "antd-mobile";
import enUS from "antd-mobile/es/locales/en-US";
import koKR from "antd-mobile/es/locales/ko-KR";
import zhCN from "antd-mobile/es/locales/zh-CN";
import zhHk from "antd-mobile/es/locales/zh-HK";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import Router from "@/router";

import api from "./api";
import Icon from "./components/icon";
import NewUserRewards from "./components/lib/newUserRewards";
import PublishTasks from "./components/lib/publishTasks";
import Loading from "./components/loading";
// import Loading from "./components/loading";
import OpenScreenAnimation from "./components/openScreenAnimation/loading";
import TgsAnimation from "./components/tgsAnimation";
import { initDataHook } from "./hooks/initData";
import { useTelegram } from "./providers/telegram";
import { useAppDispatch, useAppSelector } from "./store";
import { asyncLoading, asynUpdateTaskOptions } from "./store/telegram";

export default function App() {
  const backButton = useBackButtonRaw(true)?.result;
  const { t, i18n } = useTranslation();
  const { language } = i18n;
  const navigate = useNavigate();
  const { task } = useAppSelector((state) => state.list);
  const { tgs } = useAppSelector((state) => state.tgs);
  const { pathname, state } = useLocation();
  const [iconKey, setIconKey] = useState<string>("");
  const switchRouter = (key: string) => navigate(key);
  const { webApp } = useTelegram();
  const { load } = useAppSelector((state) => state.telegram);
  useEffect(() => {
    if (!webApp || !Object.keys(webApp).length) return;
    const startParams =
      (webApp.initDataUnsafe && webApp.initDataUnsafe.start_param) || "";
    if (!startParams || !startParams.includes("task")) return;

    navigate("/task");
  }, [webApp]);
  webApp?.initDataUnsafe.user && initDataHook();
  // Locale Mapping
  const localeMap: any = {
    "en-US": enUS,
    "zh-CN": zhCN,
    "ko-KR": koKR,
    "zh-HK": zhHk,
  };

  // Determine Locale
  const locale = localeMap?.[language] || enUS;

  // Paths where TabBar should be hidden
  const hideTabBarPaths = [
    "/list/details",
    "/invite",
    "/signin",
    "/integral",
    "/task/list",
    "/collect"
  ];
  const showTabBar = !hideTabBarPaths.includes(pathname);

  if (!showTabBar && backButton) {
    backButton.show();

    backButton.on("click", () => {
      navigate(state.path || "/");
      backButton.hide();
    });
  }

  useEffect(() => {
    window.addEventListener("focusout", () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }, 101);
    });

    // 检查页面是否已经刷新过一次
    const hasRefreshed = sessionStorage.getItem("refreshed");

    if (!hasRefreshed) {
      // 如果没有刷新过，刷新页面并记录标志
      sessionStorage.setItem("refreshed", "true");
      window.location.reload();
    }

    // 不需要移除 'refreshed' 标志，保证刷新后不会再次触发刷新
  }, []);

  const { taskOptions } = useAppSelector((state) => state.telegram);
  const [publishTaskStatus, setPublishTaskStatus] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const sumbitTask = async () => {
    if (!taskOptions.data.length) {
      await dispatch(
        asyncLoading({
          globalText: t("public.loading"),
          callBack: async () => {
            const reslut = await api.task.taskOptionsAPI("Twitter");
            await dispatch(asynUpdateTaskOptions(reslut));
          },
        })
      );
    }
    setTimeout(() => {
      setPublishTaskStatus(true);
    }, 100);
  };

  const [status, setStatus] = useState(true);
  return (
    <ConfigProvider locale={locale}>
      {status ? (
        tgs.length ? (
          <OpenScreenAnimation
            status={load.initLoading}
            onChange={() => setStatus(false)}
          />
        ) : (
          ""
        )
      ) : (
        <>
          {load.globalLoading ? (
            <Loading
              loading={load.globalLoading}
              text={load.globalText}
            ></Loading>
          ) : (
            ""
          )}
          <NewUserRewards />
          <PublishTasks
            open={publishTaskStatus}
            onClose={() => setPublishTaskStatus(false)}
          />

          <div className="h-screen flex flex-col" id="main">
            <div
              className={`flex-1 h-[calc(100vh-7rem)] ${
                showTabBar ? "" : "pb-5"
              }`}
            >
              <Router />
            </div>
            {showTabBar && (
              <div className="flex-[0]  z-[999] h-[460px] relative bg-[--primary-body-color]">
                <TabBar
                  className="z-[999] mb-7"
                  safeArea
                  onChange={(key) => {
                    if (key !== "/publish" && key !== "/publish1") {
                      switchRouter(key);
                      setIconKey(key);
                    } else {
                      sumbitTask();
                    }
                  }}
                  activeKey={iconKey || pathname}
                  defaultActiveKey="/"
                >
                  <TabBar.Item
                    className={`transition duration-300 ease-in-out ${
                      pathname === "/" ? "scale-100" : "scale-90"
                    }`}
                    key={"/"}
                    icon={(active: boolean) => (
                      <Icon name={active ? "tab/active/home" : "tab/home"} />
                    )}
                    title={t("public.home")}
                  />
                  <TabBar.Item
                    className={`transition duration-300 ease-in-out ${
                      pathname === "/list" ? "scale-100" : "scale-90"
                    }`}
                    key={"/list"}
                    icon={(active: boolean) => (
                      <Icon name={active ? "tab/active/list" : "tab/list"} />
                    )}
                    title={t("public.tabRank")}
                  />
                  <TabBar.Item
                    key={"/publish1"}
                    icon={(active: boolean) => (
                      <div className="opacity-0">
                        <Icon name={active ? "tab/active/list" : "tab/list"} />
                      </div>
                    )}
                  />
                  <TabBar.Item
                    className="!absolute left-0 top-[-20px] !w-full pointer-events-none transition duration-300 ease-in-out active:scale-90 active:opacity-80"
                    key={"/publish"}
                    icon={(_: boolean) => (
                      <div
                        className="!h-[52px] !w-[52px]  rounded-[18px] flex justify-center items-center pointer-events-auto"
                        style={{
                          background:
                            "linear-gradient(15deg, #A440FD 15.65%, #0DC8EC 74.83%)",
                        }}
                      >
                        {
                          <TgsAnimation
                            className="h-12 w-12"
                            style={{ position: "absolute", top: "0" }}
                            icon="tabsAdd"
                          ></TgsAnimation>
                        }
                      </div>
                    )}
                  />
                  <TabBar.Item
                    className={`transition duration-300 ease-in-out ${
                      pathname === "/task" ? "scale-100" : "scale-90"
                    }`}
                    badge={task.total}
                    key={"/task"}
                    icon={(active: boolean) => (
                      <Icon name={active ? "tab/active/task" : "tab/task"} />
                    )}
                    title={t("public.task")}
                  />
                  <TabBar.Item
                    className={`transition duration-300 ease-in-out ${
                      pathname === "/profile" ? "scale-100" : "scale-90"
                    }`}
                    key={"/profile"}
                    icon={(active: boolean) => (
                      <Icon
                        name={active ? "tab/active/profile" : "tab/profile"}
                      />
                    )}
                    title={t("public.profile")}
                  />
                </TabBar>
              </div>
            )}
          </div>
        </>
      )}
    </ConfigProvider>
  );
}
