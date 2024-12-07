import { Button, Ellipsis, Grid, Image } from "antd-mobile";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/box";
import MButton from "@/components/button";
import Card from "@/components/card";
import Icon from "@/components/icon";
import InfiniteScroll from "@/components/infiniteScroll";
import LinkTwitter from "@/components/lib/linkTwitter";
import ParticipateTasks from "@/components/lib/participateTasks";
import Share from "@/components/lib/share";
import ShowTaskTweet from "@/components/lib/showTaskTweet";
import TgsAnimation from "@/components/tgsAnimation";
import { useTelegram } from "@/providers/telegram";
import { useAppDispatch, useAppSelector } from "@/store";
import { ItaskData, TaskModel } from "@/store/interface";
import { asyncGetTaskList } from "@/store/list";
import { updateInitTask } from "@/store/telegram";
import { getstratParams, semicolon } from "@/util";

export const TaskItem = ({
  image,
  onShow,
  onChange,
  onShare,
  ...props
}: {
  image?: React.ReactNode;
  onShow?: () => void;
  onChange?: () => Promise<any>;
  onShare?: () => void;
} & ItaskData) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const GetStatus = () => {
    switch (props.is_top) {
      case 0:
        return <TgsAnimation icon="hot" className="w-7 h-7" />;
      case 1:
        return <TgsAnimation icon="integrals_5" className="w-7 h-7" />;
      case 2:
        return (
          <span className="text-sm font-normal text-white/50">
            {t("public.completing")}
          </span>
        );
    }
  };
  return (
    <Fragment>
      <Card animation={false}>
        <Grid columns={1} gap={16}>
          <Grid.Item className="flex items-center gap-2">
            <div className="flex justify-center items-center relative">
              <Image
                src={props.profile_image_url || ""}
                className="!w-[54px] !h-[54px] rounded-full border-[--primary] !bg-[--primary]"
              />
              <TgsAnimation
                icon="twitter"
                className="!w-4 !h-4 !rounded-full overflow-hidden absolute right-0 bottom-0"
              />
            </div>

            <Grid columns={1} gap={0}>
              <Grid.Item className="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                {props.name || ""}
              </Grid.Item>
              <Grid.Item className="text-xs font-normal flex items-center">
                {`@${props.onwer}`}
              </Grid.Item>
            </Grid>
            <div className="flex-1" />
            <GetStatus />
          </Grid.Item>
          <Grid.Item>
            <MButton animation={false}>
              <span className="overflow-hidden   inline-block break-all text-sm font-normal text-white/50">
                {(() => {
                  const texts = t("task.hostTexts", {
                    returnObjects: true,
                  }) as Array<string>;

                  return texts[Math.floor(Math.random() * texts.length)];
                })()}
              </span>
            </MButton>
          </Grid.Item>
          <Grid.Item className="flex gap-2 justify-between items-center">
            <span className="text-base font-medium flex break-all">
              <Ellipsis
                direction="end"
                content={`+${semicolon(
                  props.models.reduce((acc: number, model: TaskModel) => {
                    acc += Number(model.reward);
                    return acc;
                  }, 0)
                )}`}
                className="flex-1 break-all"
              />
              &nbsp;$MEMES
            </span>
            <div className="flex-1" />
            <Button
              size="middle"
              className="opacity-50 w-10 !px-1"
              onClick={() => onShow && onShow()}
            >
              <Icon name="show" />
            </Button>
            <Button
              size="middle"
              className="opacity-50 w-10 !px-1"
              onClick={() => onShare && onShare()}
            >
              <Icon name="share" />
            </Button>
            <Button
              className="min-w-20"
              color="primary"
              loading={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  onChange && (await onChange());
                } catch (error) {
                  console.log(error);
                }
                setLoading(false);
              }}
              size="middle"
            >
              {t("public.participate")}
            </Button>
          </Grid.Item>
        </Grid>
      </Card>
    </Fragment>
  );
};

export default function Task() {
  const { t } = useTranslation();
  const { user, taskOptions } = useAppSelector((state) => state.telegram);
  const [taskStatus, setTaskStatus] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [openLinkTwitter, setOpenLinkTwitter] = useState<boolean>(false);
  const { webApp } = useTelegram();

  const [taskData, setTaskData] = useState<ItaskData>({
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
  });
  const [showStatus, setShowStatus] = useState(false);
  const [showForm, setShowForm] = useState<ItaskData>({
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
  });
  const [shareStatus, setShareStatus] = useState(false);
  const { task } = useAppSelector((state) => state.list);
  const { initTask } = useAppSelector((state) => state.telegram);
  const getTaskData = async () => {
    if (task.data.length >= task.total) return;
    await dispatch(asyncGetTaskList({}));
  };
  const getTaskDetail = async (item: ItaskData) => {
    setTaskData(item);
    setTaskStatus(true);
  };
  const init = async () => {
    if (!webApp || !Object.keys(webApp).length || !task.data.length || initTask)
      return;
    dispatch(updateInitTask(true));
    const startParams =
      (webApp.initDataUnsafe && webApp.initDataUnsafe.start_param) || "";
    if (!startParams || !startParams.includes("task")) return;
    const result = getstratParams(startParams);
    const taskId = result.task;
    const data = task.data.find((item) => item.Id === Number(taskId));
    if (!data) return;
    getTaskDetail(data);
  };

  useEffect(() => {
    init();
  }, [webApp, task]);

  const onShow = (res: ItaskData) => {
    setShowForm(res);
    setShowStatus(true);
  };

  const onShare = (res: ItaskData) => {
    setShareStatus(true);
  };
  return (
    <>
      <LinkTwitter
        open={openLinkTwitter}
        onClose={() => setOpenLinkTwitter(false)}
      />

      <ShowTaskTweet
        data={showForm}
        visible={showStatus}
        onClose={() => setShowStatus(false)}
        onChange={async () => {
          setShowStatus(false);
          showForm && (await getTaskDetail(showForm));
        }}
      />
      <Share
        open={shareStatus}
        onClose={() => setShareStatus(false)}
        icon="money_task"
        title={t("task.share.title")}
        text={t("task.share.text")}
        url="https://www.baidu.com"
      />
      <ParticipateTasks
        initTaskDetail={async (item: ItaskData) => {
          await getTaskDetail(item);
        }}
        data={taskData}
        open={taskStatus}
        onClose={() => setTaskStatus(false)}
        setOpenLinkTwitter={setOpenLinkTwitter}
        onShow={onShow}
        onShare={onShare}
      />
      <Container className="h-[calc(100vh-3rem)] overflow-hidden relative">
        <Grid columns={1} gap={20} className="h-full">
          <Grid.Item>
            <InfiniteScroll
              topElement={
                <div className="pb-12">
                  <Grid.Item className="flex justify-center">
                    <TgsAnimation icon="money_task" className="w-20 h-20" />
                  </Grid.Item>
                  <Grid.Item>
                    <Grid columns={1} gap={4} className="text-center">
                      <Grid.Item className="text-2xl font-bold">
                        {t("task.title")}
                      </Grid.Item>
                      <Grid.Item className="text-base font-normal text-white/50">
                        {t("task.text")}
                      </Grid.Item>
                    </Grid>
                  </Grid.Item>
                </div>
              }
              height={window.innerHeight - (20 * 2 + 32)}
              data={task.data}
              loadMore={getTaskData}
              count={task.total}
              itemSize={236}
              render={({ index, data }) => (
                <TaskItem
                  {...data[index]}
                  onChange={async () => {
                    await getTaskDetail(data[index]);
                  }}
                  onShow={() => onShow(data[index])}
                  onShare={() => onShare(data[index])}
                />
              )}
            />
          </Grid.Item>
        </Grid>
      </Container>
    </>
  );
}
