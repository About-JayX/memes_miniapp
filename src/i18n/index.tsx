import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-chained-backend";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import locales from "@/config/locale";

export default i18next
  .use(HttpApi)
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: locales,
    supportedLngs: [
      ...Object.keys(locales).map((item) => item.split("-")[0]),
      ...Object.keys(locales),
    ],
    preload: Object.keys(locales),
    fallbackLng: "en-US",
    lng: "en-US",
    react: {
      useSuspense: true,
    },
    detection: {
      order: [
        "localStorage",
        "cookie",
        "navigator",
        "path",
        "querystring",
        "htmlTag",
        "subdomain",
      ],
      caches: ["localStorage", "cookie"],
    },
  });
