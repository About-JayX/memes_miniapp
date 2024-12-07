/* eslint-disable react-hooks/rules-of-hooks */
import {
  type MiniAppHeaderColor,
  SDKProvider,
  useMiniAppRaw,
  useSwipeBehaviorRaw,
  useViewportRaw,
} from "@telegram-apps/sdk-react";
import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

import { telegramInitData } from "@/config/telegram";
import { toFullHex } from "@/util";

import type { ITelegramUser, IWebApp } from "./type";

export const TelegramContext = createContext<{
  webApp?: IWebApp;
  user?: ITelegramUser;
  postData?: {
    initData: string;
    initDataUnsafe: {
      query_id: string;
      user: ITelegramUser;
      auth_date: string;
      hash: string;
    };
  };
}>({});

export const Telegram = ({ children }: { children?: React.ReactNode }) => {
  const [webApp, setWebApp] = useState<IWebApp | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (scriptLoaded) {
      let app = (window as any).Telegram?.WebApp;
      app = { ...app, ...telegramInitData }; //
      if (app) setWebApp(app);
    }
  }, [scriptLoaded]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true); // 确保加载完毕后设置
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script); // 在组件卸载时移除脚本
    };
  }, []);

  const TelegramHook = ({ children }: { children?: React.ReactNode }) => {
    if (webApp && Object.keys(webApp).length) {
      const { pathname } = useLocation();
      const viewport = useViewportRaw(true)?.result;
      const swipeBehavior = useSwipeBehaviorRaw(true)?.result;
      const miniApp = useMiniAppRaw(true)?.result;
      const root = document.documentElement;
      const computedStyles = getComputedStyle(root);

      const bgColor = computedStyles
        .getPropertyValue("--primary-bg-color")
        .trim() as MiniAppHeaderColor;

      miniApp && miniApp.setHeaderColor(toFullHex(bgColor));

      miniApp && miniApp.ready();

      if (viewport && !viewport.isExpanded) {
        viewport.expand();
      }

      swipeBehavior && swipeBehavior.disableVerticalSwipe();
    }
    return children;
  };

  const value = useMemo(() => {
    return webApp
      ? {
          webApp,
          user: webApp.initDataUnsafe.user,
          postData: {
            initData: webApp.initData,
            initDataUnsafe: webApp.initDataUnsafe,
          },
        }
      : {};
  }, [webApp]);
  return (
    <TelegramContext.Provider value={value}>
      {webApp ? (
        <SDKProvider debug>
          <TelegramHook>{children}</TelegramHook>
        </SDKProvider>
      ) : (
        <Fragment />
      )}
    </TelegramContext.Provider>
  );
};

export default function TelegramProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <Telegram>{children}</Telegram>;
}

export const useTelegram = () => useContext(TelegramContext);
