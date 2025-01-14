import { Button, Ellipsis, Grid, Image } from "antd-mobile";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import api from "@/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { ItokenData } from "@/store/interface";
import { asyncUpdateUser } from "@/store/telegram";
import { basePair } from "@/util/baseData";

import Popup from "../popup";
import Toast from "../toast";
import Card from "../card";

export default function Vote({
  open = false,
  onClose,
  uPstatus = false,
  onChange,
  voteData = basePair,
}: {
  voteData?: ItokenData | null;
  open?: boolean;
  onClose?: () => void;
  uPstatus?: boolean;
  onChange?: () => Promise<any>;
}) {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.telegram);
  const { tgs } = useAppSelector((state) => state.tgs);
  const [voteStatus, setVoteStatus] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  return (
    <Popup visible={open} onClose={onClose} height={null}>
      <Grid columns={1} gap={27}>
        <Grid.Item>
          <Grid columns={1} gap={9} className="text-center">
            <Grid.Item className="text-2xl font-bold">
              {t("vote.title")}
            </Grid.Item>
            <Grid.Item className="text-sm font-normal">
              {t("vote.text")}&nbsp;{user.Voted ? 1 : 0}/1
            </Grid.Item>
          </Grid>
        </Grid.Item>
        <Grid.Item>
          <Card animation={false}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src={voteData?.pair?.info?.imageUrl || ""}
                  className="!w-[40px] !h-[40px] rounded-full"
                />
                <div className="text-sm font-bold">
                  <Ellipsis
                    direction="end"
                    content={voteData?.pair?.baseToken.symbol || ""}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="text-sm font-bold">
                ${voteData?.pair?.priceUsd || 0}
              </div>
            </div>
          </Card>
        </Grid.Item>
        <Grid.Item>
          <Button
            size="large"
            loading={voteStatus}
            className="w-full"
            color="primary"
            onClick={async () => {
              setVoteStatus(true);
              try {
                onChange && (await onChange());
                const result = await api.user.getUser();
                await dispatch(asyncUpdateUser({ ...user, ...result }));
                Toast({
                  tgs,
                  type: "success",
                  content: t("message.vote.success"),
                });
                onClose && onClose();
              } catch (error) {
                console.log(error, "error_");
                Toast({
                  tgs,
                  type: "error",
                  content: t("message.vote.fail"),
                });
              }
              setVoteStatus(false);
            }}
          >
            {t("public.ok")}
          </Button>
        </Grid.Item>
      </Grid>
    </Popup>
  );
}
