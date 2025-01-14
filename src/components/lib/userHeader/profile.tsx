import { Divider, Ellipsis, List } from "antd-mobile";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import Button from "@/components/button";
import Card from "@/components/card";
import Icon from "@/components/icon";
import Lang from "@/components/lib/userHeader/lang";
import Popup from "@/components/popup";
import TgsAnimation from "@/components/tgsAnimation";
import { symbol } from "@/config";
import { useAppSelector } from "@/store";
import { semicolon } from "@/util";

export const ProfileList = ({
  setLangStatus,
  onClose,
}: {
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
          onClick={() => onClick({ path: "/integral" })}
          prefix={
            <Button className="!p-1">
              <Icon name="user/memes" className="!w-7 !h-7" />
            </Button>
          }
          title={t("public.myMemes")}
          clickable
        >
          {semicolon(user.token)} ${symbol}
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
          onClick={() => window.open('https://x.com/Minidoge_Ai', '_blank')}
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

  return (
    <>
      <Lang open={langStatus} onClose={() => setLangStatus(false)} />
      <Popup
        title={t("public.profile")}
        visible={open}
        onClose={() => {
          onClose && onClose();
        }}
      >
        <ProfileList
          setLangStatus={() => setLangStatus(true)}
          onClose={() => onClose && onClose()}
        />
      </Popup>
    </>
  );
}
