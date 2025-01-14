import { Button, Grid } from "antd-mobile";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import api from "@/api";
import { Container } from "@/components/box";
import Card from "@/components/card";
import Icon from "@/components/icon";
import InfiniteScroll from "@/components/infiniteScroll";
import Popup from "@/components/popup";
import TgsAnimation from "@/components/tgsAnimation";
import { useAppDispatch, useAppSelector } from "@/store";
import { asyncDetailsList } from "@/store/list";
import { asyncGetSginin, asyncUpdateUser } from "@/store/telegram";
import { semicolon } from "@/util";

const envName = import.meta.env.MODE.split("-")[1];

export const SigninItem = ({
  day = 1,
  status = false,
  text = "",
}: {
  day?: number;
  status?: boolean;
  text?: string;
}) => {
  const { t } = useTranslation();
  const week:any = t("public.week", { returnObjects: true });
  return (
    <Grid columns={1} gap={8} className="justify-items-center">
      <Grid.Item>
        <div
          className="w-[36px] h-[36px] rounded-full flex items-center justify-center"
          style={{
            background:
              status === null || status
                ? (envName === "memes" ? "rgba(91, 68, 232, 0.2)" : "") ||
                  (envName === "mego" ? "rgba(255, 255, 255, 0.2)" : "") ||
                  (envName === "minidoge" ? "rgba(255, 175, 3, 0.2)" : "")
                : "rgba(255, 255, 255, 0.05)",
          }}
        >
          <span
            className="!w-[30px] !h-[30px] rounded-full flex items-center justify-center"
            style={{
              background: status
                ? "var(--primary)"
                : (envName === "memes" ? "rgba(91, 68, 232, 0.2)" : "") ||
                  (envName === "mego" ? "rgba(255, 255, 255, 0.2)" : "") ||
                  (envName === "minidoge" ? "rgba(255, 175, 3, 0.2)" : ""),
              color: status ? "#fff" : "var(--primary)",
            }}
          >
            {status === null ? (
              text
            ) : (
              <Icon name={status ? "success" : "close"} className="p-1" />
            )}
          </span>
        </div>
      </Grid.Item>
      <Grid.Item className="text-xs font-normal">
        {week[day - 1]}
      </Grid.Item>
    </Grid>
  );
};

export const SigninComponents = ({
  open = false,
  onClose,
  amount = "0",
  text = "",
}: {
  open?: boolean;
  onClose?: () => void;
  amount: string;
  text: string;
}) => {
  const { t } = useTranslation();
  return (
    <Popup
      visible={open}
      onClose={onClose}
      footer={
        <Button
          size="large"
          color="primary"
          className="w-full"
          onClick={() => onClose && onClose()}
        >
          {t("public.ok")}
        </Button>
      }
    >
      <Grid
        columns={1}
        gap={24}
        className="justify-items-center text-center mt-2"
      >
        <Grid.Item>
          <TgsAnimation icon="money" className="w-20 h-20" />
        </Grid.Item>
        <Grid.Item>
          <Grid columns={1} gap={10}>
            <Grid.Item className="text-2xl font-bold">{text}</Grid.Item>
            <Grid.Item className="text-sm font-normal">
              {t("public.get")} +{semicolon(amount)}
            </Grid.Item>
          </Grid>
        </Grid.Item>
      </Grid>
    </Popup>
  );
};

export default function Signin() {
  const { t } = useTranslation();
  const [signinStatus, setSigninStatus] = useState(false);
  const [signinAmount, setSigninAmount] = useState("");
  const [signText, setSignText] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<boolean>(false);
  const { user, signInInfo } = useAppSelector((state) => state.telegram);
  const dispatch = useAppDispatch();
  const sginin = async () => {
    setCheckInStatus(true);
    const result = await api.sginin.sgininAPI();
    if (result.status) {
      const promises = [
        dispatch(asyncGetSginin()),
        dispatch(asyncDetailsList({ page: 1 })),
      ];
      const result = await api.user.getUser();
      await dispatch(asyncUpdateUser({ ...user, ...result }));
      await Promise.all(promises);
      setSignText(t("message.signin.success"));
      setSigninAmount(signInInfo.Dailyrewards);
      setSigninStatus(true);
    }
    setCheckInStatus(false);
  };

  return (
    <>
      <SigninComponents
        text={signText}
        amount={signinAmount}
        open={signinStatus}
        onClose={() => setSigninStatus(false)}
      />
      <Container className="overflow-hidden h-screen">
        <Grid columns={1} gap={20}>
          <Grid.Item className="text-center">
            <Grid columns={1} gap={2}>
              <Grid.Item className="flex justify-center">
                <TgsAnimation icon="money_fly" className="w-20 h-20" />
              </Grid.Item>
            </Grid>
          </Grid.Item>
          <Grid.Item className="text-center">
            <Grid columns={1} gap={4}>
              <Grid.Item className="text-2xl font-bold">
                {t("signin.title")}
              </Grid.Item>
              <Grid.Item className="text-base font-normal text-white/50">
                {t("signin.text")}
              </Grid.Item>
            </Grid>
          </Grid.Item>
          <Grid.Item>
            <Card>
              <Grid columns={1} gap={20}>
                <Grid.Item className="text-base font-bold flex items-center">
                  {t("public.signedIn")}&nbsp;
                  <span className="text-sm font-medium text-[--primary] text-[1.2em]">
                    {signInInfo.rewards.filter((item) => item.signedIn).length}
                  </span>
                </Grid.Item>
                {/* 签到 */}
                <Grid.Item>
                  {/* 0 未连续签到 */}
                  <Grid columns={7} gap={8}>
                    {signInInfo.rewards.map((item, index) => (
                      <Grid.Item key={index}>
                        <SigninItem
                          day={item.day}
                          status={item.signedIn}
                          text={`+${semicolon(signInInfo.Dailyrewards)}`}
                        />
                      </Grid.Item>
                    ))}
                  </Grid>
                </Grid.Item>
                <Grid.Item>
                  <Button
                    loading={checkInStatus}
                    color={"primary"}
                    disabled={signInInfo.todaySignedIn || false}
                    className="w-full"
                    onClick={async () => {
                      if (signInInfo.todaySignedIn) return;
                      await sginin();
                    }}
                  >
                    {signInInfo.todaySignedIn
                      ? t("public.checkedIn")
                      : t("public.checkIn")}
                  </Button>
                </Grid.Item>
              </Grid>
            </Card>
          </Grid.Item>
          <Grid.Item>
            <Grid columns={1} gap={16}>
              <Grid.Item className="text-base font-bold">
                {t("public.pointsTask")}
              </Grid.Item>
              <Grid.Item>
                <InfiniteScroll
                  data={signInInfo.task}
                  count={signInInfo.task.length}
                  height={
                    window.innerHeight - (80 + 84 + 184 + 24 + 26 * 3 + 52)
                  }
                  itemSize={64}
                  render={({ index, data }) => (
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex gap-3">
                        {/* <div className="w-[36px] h-[36px]  rounded-lg bg-[rgba(153,69,255,1)]"></div> */}
                        <Grid columns={1} gap={2}>
                          <Grid.Item className="text-sm font-bold">
                            {t("signin.checkin_days", {
                              type:
                                data[index].type === "accumulation"
                                  ? t("signin.cumulative")
                                  : t("signin.consecutive"),
                              day: data[index].day,
                            })}
                          </Grid.Item>
                          <Grid.Item className="text-xs font-normal">
                            {t("signin.extra_reward", {
                              type:
                                data[index].type === "accumulation"
                                  ? t("signin.cumulative")
                                  : t("signin.consecutive"),
                              reward: semicolon(data[index].reward),
                            })}
                          </Grid.Item>
                        </Grid>
                      </div>
                      <Button
                        loading={claimLoading}
                        color="default"
                        onClick={async () => {
                          if (!data[index].canClaim) return;
                          setClaimLoading(true);
                          try {
                            await api.sginin.claimReward({
                              day: data[index].day,
                              type: data[index].type,
                            });
                            const promises = [
                              dispatch(asyncGetSginin()),
                              dispatch(asyncDetailsList({ page: 1 })),
                            ];
                            const result = await api.user.getUser();
                            await dispatch(
                              asyncUpdateUser({ ...user, ...result })
                            );
                            await Promise.all(promises);
                            setSignText(t("message.claimSuccess"));
                            setSigninAmount(data[index].reward);
                            setSigninStatus(true);
                          } catch (error) {
                            console.log(error, "error_");
                          }

                          setClaimLoading(false);
                        }}
                        className={`!whitespace-nowrap ${
                          data[index].canClaim
                            ? "!border !border-[--primary] !text-[--primary]"
                            : ""
                        }`}
                      >
                        {data[index].canClaim === null
                          ? t("signin.received")
                          : data[index].canClaim
                          ? t("signin.pending")
                          : t("signin.notReceived")}
                      </Button>
                    </div>
                  )}
                />
              </Grid.Item>
            </Grid>
          </Grid.Item>
        </Grid>
      </Container>
    </>
  );
}
