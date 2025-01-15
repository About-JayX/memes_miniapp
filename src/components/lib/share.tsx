import { useUtilsRaw } from "@telegram-apps/sdk-react";
import { Button, Grid } from "antd-mobile";
import { useTranslation } from "react-i18next";

import { inviteUrl } from "@/config/invite";
import { useAppSelector } from "@/store";
import { copy } from "@/util";

import Popup from "../popup";
import TgsAnimation from "../tgsAnimation";
import { UserIcon } from "./userHeader";
import Icon from "../icon";

export default function Share({
  url = "",
  icon = "",
  title = "",
  text = "",
  open = false,
  onClose,
}: {
  title?: string;
  text?: string;
  url?: string;
  icon?: string;
  open?: boolean;
  onClose?: () => void;
}) {
  const { t } = useTranslation();
  const utils = useUtilsRaw(true)?.result;
  const { tgs } = useAppSelector((state) => state.tgs);

  const handleTwitterShare = () => {
    const text = `${t("invite.inviteFriendsTexts")}\n\n`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.location.href = twitterUrl;
    onClose && onClose();
  };
  return (
    <Popup visible={open} onClose={onClose} height={null} className="!z-[1001]">
      <Grid
        columns={1}
        gap={24}
        className="justify-items-center py-2 text-center"
      >
        <Grid.Item>
          <TgsAnimation icon={icon} className="w-20 h-20" />
        </Grid.Item>
        <Grid.Item>
          <Grid columns={1} gap={10}>
            <span className="text-2xl font-bold">{title}</span>
            <span className="text-base font-normal">{text}</span>
          </Grid>
        </Grid.Item>
        <Grid.Item className="flex gap-2">
          {/* 电报 */}
          <UserIcon
            onClick={() => {
              utils && utils.shareURL(url, t("invite.inviteFriendsTexts"));
              onClose && onClose();
            }}
          >
            <Icon name="telegram" />
          </UserIcon>
          {/* 推特 */}
          <UserIcon onClick={() => handleTwitterShare()}>
            <Icon name="twitter" />
          </UserIcon>
          {/* 复制 */}
          <UserIcon
            onClick={() => {
              copy(tgs, `${url}\n${t("invite.inviteFriendsTexts")}`);
              onClose && onClose();
            }}
          >
            <Icon name="copy" />
          </UserIcon>
        </Grid.Item>
        <Grid.Item className="w-full">
          <Grid columns={1} gap={12}>
            <Grid.Item>
              <Button
                size="large"
                color="primary"
                className="w-full [&>span]:!text-black"
                onClick={() => {
                  copy(tgs, `${url}\n${t("invite.inviteFriendsTexts")}`);
                  onClose && onClose();
                }}
              >
                {t("public.copy")}
              </Button>
            </Grid.Item>
            <Grid.Item>
              <Button
                size="large"
                onClick={() => {
                  utils && utils.shareURL(url, t("invite.inviteFriendsTexts"));
                  onClose && onClose();
                }}
                color="default"
                className="w-full !text-[--primary] !border-[--primary]"
              >
                {t("public.share")}
              </Button>
            </Grid.Item>
            <Grid.Item>
              <Button
                size="large"
                onClick={handleTwitterShare}
                color="default"
                className="w-full !text-[--primary] !border-[--primary]"
              >
                {t("public.shareToX")}
              </Button>
            </Grid.Item>
          </Grid>
        </Grid.Item>
      </Grid>
    </Popup>
  );
}
