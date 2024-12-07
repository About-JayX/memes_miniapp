import { Divider, Ellipsis, List } from "antd-mobile";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import Button from "@/components/button";
import Card from "@/components/card";
import Icon from "@/components/icon";
import LinkTwitter from "@/components/lib/linkTwitter";
import Lang from "@/components/lib/userHeader/lang";
import Popup from "@/components/popup";
import TgsAnimation from "@/components/tgsAnimation";
import { useAppSelector } from "@/store";
import { semicolon } from "@/util";

export const ProfileList = ({
  setOpenLinkTwitter,
  setLangStatus,
  onClose,
}: {
  setOpenLinkTwitter?: (e: boolean) => void;
  setLangStatus?: (e: boolean) => void;
  onClose?: () => void;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.telegram);
  const onClick = ({ path = "", to }: { path?: string; to?: string }) => {
    onClose && onClose();
    setTimeout(() => navigate(path, { state: { path: to } }), 300);
  };
  return (
    <Card>
      <List>
        <List.Item
          prefix={
            <Button className="!p-1">
              <Icon name="tab/profile" className="!w-7 !h-7 p-[6px]" />
            </Button>
          }
          title={t("public.telegram")}
          clickable
        >
          <Ellipsis direction="end" content={`@${user.username}`} />
        </List.Item>
        <List.Item
          onClick={() =>
            !user.twitterUserName &&
            setOpenLinkTwitter &&
            setOpenLinkTwitter(true)
          }
          prefix={
            <Button className="!p-1">
              <Icon name="user/twitter" className="!w-7 !h-7" />
            </Button>
          }
          title={t("public.bindTwitter")}
          clickable
        >
          <Ellipsis
            direction="middle"
            content={user.twitterUserName ? `@${user.twitterUserName}` : "--"}
          />
        </List.Item>
        <List.Item
          onClick={() => onClick({ path: "/integral" })}
          prefix={
            <Button className="!p-1">
              <Icon name="user/memes" className="!w-7 !h-7" />
            </Button>
          }
          title={t("public.myMemes")}
          clickable
        >
          {semicolon(user.token)} $MEMES
        </List.Item>
        <List.Item
          onClick={() => onClick({ path: "/collect" })}
          prefix={
            <Button className="!p-1">
              <Icon name="tab/collect" className="!w-7 !h-7" />
            </Button>
          }
          clickable
        >
          {t("public.collect")}
        </List.Item>
        <List.Item>
          <Divider />
        </List.Item>
        <List.Item
          onClick={() => onClick({ path: "/task/list" })}
          prefix={<TgsAnimation icon="task" className="!w-10 !h-10" />}
          clickable
        >
          {t("public.taskManagement")}
        </List.Item>
        <List.Item
          prefix={<TgsAnimation icon="lang" className="!w-10 !h-10" />}
          clickable
          description={t("language")}
          onClick={() => setLangStatus && setLangStatus(true)}
        >
          {t("lang")}
        </List.Item>
      </List>
    </Card>
  );
};
export default function Profile({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const { t } = useTranslation();
  const [langStatus, setLangStatus] = useState<boolean>(false);
  const [openLinkTwitter, setOpenLinkTwitter] = useState<boolean>(false);

  return (
    <>
      <Lang open={langStatus} onClose={() => setLangStatus(false)} />
      <LinkTwitter
        open={openLinkTwitter}
        onClose={() => setOpenLinkTwitter(false)}
      />
      <Popup
        title={t("public.profile")}
        visible={open}
        onClose={() => {
          onClose && onClose();
        }}
      >
        <ProfileList
          setOpenLinkTwitter={() => setOpenLinkTwitter(true)}
          setLangStatus={() => setLangStatus(true)}
          onClose={() => onClose && onClose()}
        />
      </Popup>
    </>
  );
}
