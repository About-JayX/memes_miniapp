import { Button, type PopupProps } from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tweet } from "react-tweet";

import { ItaskData } from "@/store/interface";

import Popup from "../popup";

export default function ShowTaskTweet({
  data = {
    Id: 0,
    name: "",
    userId: 0,
    onwer: "",
    description: "",
    is_enabled: 0,
    created_at: 0,
    updated_at: 0,
    rewards: "",
    pay_amount: "",
    remaining_amount: "",
    models: [],
    urls: {
      TweetId: "",
    },
    notifyId: 0,
    profile_image_url: "",
    is_top: 0,
  },
  onChange,
  ...props
}: { data: ItaskData; onChange?: () => void } & PopupProps) {
  const [id, setId] = useState("");
  const tweetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ids = data.urls.TweetId.split("/");
    setId(ids[ids.length - 1]);
  }, [data]);

  useEffect(() => {
    if (!id) return;

    const observer = new MutationObserver(() => {
      const whites = [
        "replies",
        "actions",
        "authorFollow",
        "brand",
        "infoLink",
      ];
      const ele = tweetRef.current?.querySelectorAll("div, a");

      if (ele) {
        Array.from(ele).forEach((item) => {
          if (whites.some((w) => item.classList.value.includes(w))) {
            item.remove();
          }
        });
      }
    });
    // 配置观察器，观察目标节点及其子节点的变化
    const tweetElement = tweetRef.current;
    if (tweetElement) {
      observer.observe(tweetElement, { childList: true, subtree: true });
    }

    // 清理观察器
    return () => observer.disconnect();
  }, [id]);

  const { t } = useTranslation();
  return (
    <Popup
      className="!z-[1001]"
      {...props}
      footer={
        <Button
          className="w-full animate-pulseScale"
          color="primary"
          size="large"
          onClick={() => onChange && onChange()}
        >
          {t("public.participate")}
        </Button>
      }
    >
      {id ? (
        <div
          className="w-full max-h-[60vh]"
          data-theme="light"
          ref={tweetRef}
          onClick={(e) => e.preventDefault()}
        >
          <Tweet id={id} />
        </div>
      ) : (
        ""
      )}
      {/* 查看推文 */}
    </Popup>
  );
}
