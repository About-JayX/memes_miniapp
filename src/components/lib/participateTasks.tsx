import {
  Button,
  Card,
  Collapse as Collapses,
  Ellipsis,
  Grid,
  Image,
} from "antd-mobile";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import api from "@/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { ItaskData, TaskModel } from "@/store/interface";
import { asyncDetailsList, updateTasks } from "@/store/list";
import { asyncUpdateUser } from "@/store/telegram";
import { semicolon } from "@/util";

import Collapse from "../collapse";
import Icon from "../icon";
import Popup from "../popup";
import TgsAnimation from "../tgsAnimation";
import Toast from "../toast";

export default function ParticipateTasks({
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
  open = false,
  onClose,
  setOpenLinkTwitter,
  initTaskDetail,
  onShow,
  onShare
}: {
  data: ItaskData;
  open?: boolean;
  initTaskDetail: (item: ItaskData) => Promise<void>;
  onClose?: () => void;
  setOpenLinkTwitter?: (value: boolean) => void;
  onShow?: (e:ItaskData) => void;
  onShare?: (e: ItaskData) => void;
}) {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.telegram);
  const { tgs } = useAppSelector((state) => state.tgs);
  const { task } = useAppSelector((state) => state.list);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const opearateTask = async (item: TaskModel) => {
    setLoading(true);

    try {
      let result = await api.task.opearateTaskAPI({
        detailId: item.Id,
      });
      if (!result.status) throw new Error("opearate failed");
      const a = task.data.map((task) => {
        if (task.Id !== data.Id) return task;
        const ms = task.models.map((model) => {
          if (model.Id !== item.Id) return model;
          const m = { ...model, ifIoear: true };
          return m;
        });
        return { ...task, models: ms };
      });
      dispatch(updateTasks(a));
      const promises = [dispatch(asyncDetailsList({ page: 1 }))];
      result = await api.user.getUser();
      await dispatch(asyncUpdateUser({ ...user, ...result }));
      await Promise.all(promises);
      const o: ItaskData = {
        ...data,
        models: data.models.map((model) => {
          if (model.Id === item.Id) {
            const m = { ...model, ifIoear: true };
            return m;
          }
          return model;
        }),
      };
      await initTaskDetail(o);
      Toast({
        tgs,
        type: "success",
        content: t("message.operate.success"),
      });
    } catch (error) {
      console.log(error, "??");

      Toast({
        tgs,
        type: "error",
        content: t("message.operate.error"),
      });
    }

    setLoading(false);
  };
  const groupByType = (data: Array<TaskModel>) => {
    const grouped = data.reduce((acc: any, item: TaskModel) => {
      const { type } = item;
      let group = acc.find((g: any) => g.type === type);
      if (!group) {
        group = { type, data: [] };
        acc.push(group);
      }
      group.data.push(item);
      return acc;
    }, []);
    return grouped;
  };

  const getTaskDetail = () => {
    const list = groupByType(data.models);
    return list.map(
      (item: { type: string; data: Array<TaskModel> }, index: number) => (
        <Grid.Item key={index}>
          <Grid columns={1} gap={14}>
            <Grid.Item className="flex items-center gap-[5px]">
              <span className="text-base font-normal">
                {t("public.completeXSocialMediaTasks", {
                  count: item.data.length || 0,
                })}
              </span>
              <div className="flex-1" />
              {user.twitterUserName ? (
                <span className="text-base font-normal">
                  @{user.twitterUserName}
                </span>
              ) : (
                <Button
                  onClick={async () =>
                    setOpenLinkTwitter && setOpenLinkTwitter(true)
                  }
                  color="default"
                  size="mini"
                  className="!border !border-[--primary-border-color] !text-sm font-bold"
                >
                  {t("public.link")}
                </Button>
              )}
            </Grid.Item>
            {/* 添加翻译 */}
            {item.data.map((cItem, index) => (
              <Grid.Item key={index}>
                <Collapse defaultActiveKey={["focusOn"]}>
                  <Collapses.Panel
                    key="focusOn"
                    title={`${t(`public.${cItem.model}`)} ${data.name} ${t(
                      "public.xTweets"
                    )}`}
                  >
                    <Grid columns={2} gap={10} className="mt-[-10px]">
                      <Button
                        disabled={cItem.ifIoear || false}
                        color={cItem.ifIoear ? "default" : "primary"}
                        loading={loading}
                        onClick={() => {
                          if (cItem.ifIoear) return;
                          user.twitterUserName
                            ? opearateTask(cItem)
                            : setOpenLinkTwitter && setOpenLinkTwitter(true);
                        }}
                      >
                        {cItem.ifIoear
                          ? t("public.completed")
                          : t(`public.${cItem.model}`)}
                      </Button>
                      <Button
                        color="default"
                        className={`${
                          cItem.ifIoear ? "!text-[--primary]" : ""
                        }`}
                        disabled
                      >
                        {`+${semicolon(cItem.reward)}`}
                      </Button>
                    </Grid>
                  </Collapses.Panel>
                </Collapse>
              </Grid.Item>
            ))}
          </Grid>
        </Grid.Item>
      )
    );
  };
  useEffect(() => {}, [data]);
  return (
    <>
      <Popup visible={open} onClose={onClose}>
        <Grid columns={1} gap={26}>
          <Grid.Item className="flex justify-center">
            <TgsAnimation icon="twitter" className="w-14 h-14" />
          </Grid.Item>
          <Grid.Item className="text-center">
            <Grid columns={1} gap={9}>
              <Grid.Item className="text-2xl font-bold">
                {t("public.getInvolvedNow")}
              </Grid.Item>
              <Grid.Item className="text-base font-normal">
                {t("public.getInvolvedNowText")}
              </Grid.Item>
            </Grid>
          </Grid.Item>
          <Grid.Item className="flex justify-center gap-3">
            <Button
              size="middle"
              className="opacity-50 w-10 !px-1"
              onClick={() => onShow && onShow(data)}
            >
              <Icon name="show" />
            </Button>
            <Button
              size="middle"
              className="opacity-50 w-10 !px-1"
              onClick={() => onShare && onShare(data)}
            >
              <Icon name="share" />
            </Button>
          </Grid.Item>
          <Grid.Item>
            <Card className="!bg-[--primary-card-body-color]">
              <Grid columns={1} gap={16}>
                <Grid.Item className="grid grid-cols-[54px,1fr,32px] items-center gap-2">
                  <Image
                    src={data.profile_image_url || ""}
                    className="!w-[54px] !h-[54px] rounded-full border-[2px] border-[--primary] !bg-[--primary]"
                  />
                  <Grid columns={1} gap={0} className="">
                    <Grid.Item className="text-base font-bold">
                      {data.name}
                    </Grid.Item>
                    {data.onwer && (
                      <Grid.Item className="flex">
                        <Ellipsis
                          content={`@${data.onwer}`}
                          direction="middle"
                          className="break-all text-xs font-normal text-[#F0F0F2]"
                        />
                      </Grid.Item>
                    )}
                  </Grid>
                  <TgsAnimation icon="twitter" className="w-[32px] h-[32px]" />
                </Grid.Item>
              </Grid>
            </Card>
          </Grid.Item>
          {getTaskDetail()}
        </Grid>
      </Popup>
    </>
  );
}
