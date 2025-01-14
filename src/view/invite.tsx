import { Button, Card, Ellipsis, Grid, Image } from "antd-mobile";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/box";
import InfiniteScroll from "@/components/infiniteScroll";
import InviteFriends from "@/components/lib/inviteFriends";
import TgsAnimation from "@/components/tgsAnimation";
import { useAppDispatch, useAppSelector } from "@/store";
import { asyncGetInviteList } from "@/store/list";
import { getTextColorForBackground, semicolon } from "@/util";

export const InviteItme = ({
  name = "",
  amount = "",
  avatar = "",
}: {
  name?: string;
  amount?: string;
  avatar?: string;
}) => {
  const { backgroundColor, textColor } = getTextColorForBackground(name);

  return (
    <Card className="!bg-[--primary-card-body-color]">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-[10px] items-center flex-1">
          {avatar ? (
            <Image
              className="!w-[40px] !h-[40px] rounded-full text-base font-medium flex items-center justify-center"
              src={avatar}
            ></Image>
          ) : (
            <div
              className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-base font-medium`}
              style={{ background: backgroundColor, color: textColor }}
            >
              {name.slice(0, 2).toLocaleUpperCase()}
            </div>
          )}

          <span className="text-sm font-bold">
            {" "}
            <Ellipsis direction="end" content={`@${name}`} />
          </span>
        </div>
        <span>+{semicolon(amount)}</span>
      </div>
    </Card>
  );
};

export default function Invite() {
  const { t } = useTranslation();
  const [inviteFriendsStatus, setInviteFriendsStatus] =
    useState<boolean>(false);
  const { invite } = useAppSelector((state) => state.list);
  const dispatch = useAppDispatch();
  const getVoteData = async () => {
    if (invite.data.length >= invite.total) return;
    await dispatch(asyncGetInviteList({}));
  };
  return (
    <>
      <InviteFriends
        open={inviteFriendsStatus}
        onClose={() => setInviteFriendsStatus(false)}
      />
      <Container>
        <Grid
          columns={1}
          gap={20}
          className={`justify-items-center overflow-hidden max-h-[calc(100vh-${
            112 + 16
          }px)]`}
        >
          <Grid.Item className="text-center">
            <Grid columns={1} gap={2}>
              <Grid.Item>
                <TgsAnimation icon="money" className="w-20 h-20" />
              </Grid.Item>
            </Grid>
          </Grid.Item>
          <Grid.Item className="text-center">
            <Grid columns={1} gap={4}>
              <Grid.Item className="text-2xl font-bold text-[--secondary-text-color]">
                {t("invite.title")}
              </Grid.Item>
              <Grid.Item className="text-base font-normal text-white/50">
                {t("invite.text")}
              </Grid.Item>
            </Grid>
          </Grid.Item>
          <Grid.Item className="w-full">
            <Grid columns={1} gap={16}>
              <Grid.Item className="flex items-center">
                <span className="text-base font-bold text-[--secondary-text-color]">
                  {t("public.invite")}
                </span>
                <span className="ml-2 text-[17px] font-medium text-[--primary] text-[1.2em]">
                  {semicolon(invite.total)}
                </span>
                <div className="flex-1"></div>
              </Grid.Item>
              <Grid columns={1} gap={8}>
                <InfiniteScroll
                  height={
                    window.innerHeight - (112 + 80 + 84 + 24 + 20 * 2 + 16)
                  }
                  data={invite.data}
                  loadMore={getVoteData}
                  count={invite.total}
                  itemSize={80}
                  render={({ index, data }) => (
                    <InviteItme
                      avatar={data[index].avatar_url}
                      name={data[index].userName}
                      amount={data[index].rewardAmount}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid.Item>
          <Grid.Item className="fixed left-0 bottom-0 w-full bg-[--primary-bg-color] h-28">
            <Container>
              <Button
                size="large"
                color="primary"
                className="w-full animate-pulseScale [&>span]:!text-black"
                onClick={() => setInviteFriendsStatus(true)}
              >
                {t("public.inviteFriends")}
              </Button>
            </Container>
          </Grid.Item>
        </Grid>
      </Container>
    </>
  );
}
