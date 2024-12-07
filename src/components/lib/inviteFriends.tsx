import { useUtilsRaw } from "@telegram-apps/sdk-react";
import { useTranslation } from "react-i18next";

import { inviteUrl } from "@/config/invite";
import { useAppSelector } from "@/store";

import Share from "./share";

export default function InviteFriends({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.telegram);
  return (
    <Share
      open={open}
      onClose={onClose}
      url={inviteUrl(user.code)}
      icon="friends"
      title={t("public.inviteFriends")}
      text={t("invite.inviteFriendsText")}
    />
  );
}
