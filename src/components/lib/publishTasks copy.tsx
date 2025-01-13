import { Select } from "antd";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  type ImageUploadItem,
  Slider,
} from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import api from "@/api";
import { symbol } from "@/config";
import sliderConfig from "@/config/sliderConfig";
import { useAppDispatch, useAppSelector } from "@/store";
import { ITaskOptions } from "@/store/interface";
import {
  asyncDetailsList,
  asyncGetTaskList,
  asyncUserTaskList,
} from "@/store/list";
import { asyncUpdateUser } from "@/store/telegram";
import { semicolon } from "@/util";

import Icon from "../icon";
import ImageUploader from "../imageUploader";
import Input from "../input";
import Popup from "../popup";
import Toast from "../toast";
import { IPublishTaskDetails } from "./interface/IPublishTasks";
import LinkTwitter from "./linkTwitter";
import TelegramLink from "./telegramLink";

export default function PublishTasks({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ITaskOptions>({ uniqueKeys: [], data: [] });
  const { taskOptions, user } = useAppSelector((state) => state.telegram);
  const { tgs } = useAppSelector((state) => state.tgs);
  const { userTask } = useAppSelector((state) => state.list);
  const [url, setUrl] = useState<any>({});

  const [notify, setNotify] = useState("");
  const { t } = useTranslation();
  const [amount, setAmount] = useState("5");
  const photo = useRef<FormData>(new FormData());
  const [assessLoading, setAssessLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [addTelegramLinkStatus, setAddTelegramLinkStatus] = useState(false);
  const { notifys } = useAppSelector((state) => state.list);
  const [imgs, setImgs] = useState<ImageUploadItem[]>([]);
  const [file, setFile] = useState<any>();
  const dispatch = useAppDispatch();
  const [openLinkTwitter, setOpenLinkTwitter] = useState<boolean>(false);
  const [publishTaskDetails, setPublishTaskDetails] =
    useState<IPublishTaskDetails>({
      status: true,
      iv: "",
      models: [
        {
          model: "",
          reviewMethodId: 0,
          value: "",
          current: 0,
          max: "0",
        },
      ],
      pay_amount: 0,
      task: {
        name: "",
        userId: 0,
        notify: null, // 允许为空
        onwer: "", // "onwer" 可以保持不变，但建议修正为 "owner"
        description: "",
        is_enabled: 0, // 0表示禁用，1表示启用，建议将其改为 boolean
        rewards: 0,
        pay_amount: 0,
        urls: {
          TweetId: "",
        },
      },
      message: "",
    });
  const assessTask = async () => {
    if (!user.twitterId) {
      setOpenLinkTwitter(true);
      return;
    }
    photo.current = new FormData();
    setAssessLoading(true);
    // photo.current.append('description', description)
    photo.current.append("photo", file);
    photo.current.append("type", "Twitter");
    photo.current.append("notifyId", notify);
    photo.current.append("amount", amount.toString());

    // photo.current.append('contractAddress', address)
    photo.current.append("urls", JSON.stringify(url));
    const models: Array<string> = [];
    data.data.forEach((item) => item.is_enabled && models.push(item.model));
    photo.current.append("models", JSON.stringify(models));
    try {
      const result: IPublishTaskDetails = await api.task.taskAssessAPI(
        photo.current
      );
      if (!result.status) throw new Error(result.message);

      setPublishTaskDetails(result);
      setStep(2);
    } catch (error: any) {
      Toast({
        tgs,
        type: "error",
        content: error.message || "",
      });
    }
    setAssessLoading(false);
  };
  const closeModal = () => {
    setStep(1);
    setUrl({});
    setNotify("");
    setAmount("5");
    photo.current = new FormData();
    setPublishTaskDetails({
      status: true,
      iv: "",
      models: [
        {
          model: "",
          reviewMethodId: 0,
          value: "",
          current: 0,
          max: "0",
        },
      ],
      pay_amount: 0,
      task: {
        name: "",
        userId: 0,
        notify: null, // 允许为空
        onwer: "", // "onwer" 可以保持不变，但建议修正为 "owner"
        description: "",
        is_enabled: 0, // 0表示禁用，1表示启用，建议将其改为 boolean
        rewards: 0,
        pay_amount: 0,
        urls: {
          TweetId: "",
        },
      },
      message: "",
    });
    onClose && onClose();
  };
  const publishTask = async () => {
    setPublishLoading(true);
    try {
      await api.task.releaseTaskAPI(publishTaskDetails.iv);

      const asyncs = [
        dispatch(
          asyncUserTaskList({
            page: 1,
            pageSize:
              (userTask.page - 1 ? userTask.page - 1 : 1) * userTask.pageSize,
          })
        ),
        dispatch(asyncDetailsList({ page: 1 })),
        dispatch(asyncGetTaskList({ page: 1 })),
      ];
      await Promise.all(asyncs);

      const result = await api.user.getUser();
      await dispatch(asyncUpdateUser({ ...user, ...result }));
      closeModal();
      Toast({
        tgs,
        type: "success",
        content: t("message.publishTask.success"),
      });
    } catch (error) {
      Toast({
        tgs,
        type: "error",
        content: t("message.publishTask.error"),
      });
    }

    setPublishLoading(false);
  };

  useEffect(() => {
    if (open && taskOptions.data.length) {
      setData(taskOptions);
    }
  }, [open, taskOptions]);
  return (
    <>
      <LinkTwitter
        open={openLinkTwitter}
        onClose={() => setOpenLinkTwitter(false)}
      />
      <TelegramLink
        open={addTelegramLinkStatus}
        onClose={() => setAddTelegramLinkStatus(false)}
      />
      <Popup
        visible={open}
        onClose={closeModal}
        footer={
          <Grid columns={1} gap={27}>
            {step === 2 && (
              <Grid.Item className="text-base text-center">
                <span className="font-medium text-[#F0F0F2]">
                  Need to pay :{" "}
                </span>
                <span className="font-bold">
                  {semicolon(publishTaskDetails.pay_amount)} ${symbol}
                </span>
              </Grid.Item>
            )}

            <Grid.Item className="flex gap-[10px] items-center ">
              {step === 1 ? (
                <Button
                  size="large"
                  color="primary"
                  className="w-full"
                  onClick={assessTask}
                  loading={assessLoading}
                >
                  {t("public.nextStep")}
                </Button>
              ) : (
                <>
                  <Button
                    size="large"
                    color="default"
                    className="w-full"
                    onClick={() => setStep(1)}
                  >
                    {t("public.previousStep")}
                  </Button>
                  <Button
                    size="large"
                    loading={publishLoading}
                    color="primary"
                    className="w-full"
                    onClick={publishTask}
                  >
                    {t("public.release")}
                  </Button>
                </>
              )}
            </Grid.Item>
          </Grid>
        }
      >
        <Grid columns={1} gap={26} className="popup-grid">
          <Grid.Item className="flex justify-end">
            <Button
              color="default"
              size="small"
              className="!border !border-[--primary-border-color]"
            >
              {step}/2
            </Button>
          </Grid.Item>
          <Grid.Item className="w-full">
            <Grid
              columns={1}
              gap={27}
              className="grid justify-items-center text-center"
            >
              <Grid.Item>
                <Icon name="twitter" className="!w-14 !h-14 rounded-lg" />
              </Grid.Item>
              <Grid.Item>
                <Grid columns={1} gap={8}>
                  <Grid.Item className="text-2xl font-bold">
                    {t("task.taskManagement.title")}
                  </Grid.Item>
                  <Grid.Item className="text-base font-normal">
                    {t("task.taskManagement.text")}
                  </Grid.Item>
                </Grid>
              </Grid.Item>
            </Grid>
          </Grid.Item>
          {step === 1 ? (
            <>
              {data.uniqueKeys.map((item,index) => (
                <Grid.Item key={index}>
                  <Grid columns={1} gap={14}>
                    <Grid.Item className="text-xs font-medium">
                      {t(`public.${item}`)}&nbsp;
                      <span className="text-[--error-color]">*</span>
                    </Grid.Item>
                    <Grid.Item>
                      <Input
                        value={url[item]}
                        onChange={(e) => setUrl({ ...url, [item]: e })}
                        placeholder={t("public.enterAddress")}
                      />
                    </Grid.Item>
                  </Grid>
                </Grid.Item>
              ))}
              <Grid.Item>
                <Grid columns={1} gap={14}>
                  <Grid.Item className="text-xs font-medium">
                    {t("public.taskSelection")}&nbsp;
                    <span className="text-white/50">
                      ({t("public.everyTask")} 100 ${symbol})
                    </span>
                    &nbsp;<span className="text-[--error-color]">*</span>
                  </Grid.Item>
                  <Grid.Item className="w-full overflow-hidden">
                    <Slider
                      max={50}
                      min={0}
                      ticks
                      defaultValue={Number(amount)}
                      marks={sliderConfig}
                      onAfterChange={(value) => setAmount(value.toString())}
                    />
                  </Grid.Item>
                </Grid>
              </Grid.Item>
              <Grid.Item className="flex flex-wrap items-center gap-3">
                {data.data.map((item, index) => (
                  <Checkbox
                    style={{ "--icon-size": "2.125rem" }}
                    key={index}
                    checked={item.is_enabled ? true : false}
                    onChange={(e) => {
                      const nData = {
                        ...data,
                        data: data.data.map((c) => {
                          if (c.model === item.model) {
                            c = { ...c, is_enabled: e ? 1 : 0 };
                          }
                          return c;
                        }),
                      };
                      setData({ ...nData });
                    }}
                  >
                    {t(`public.${item.model}`)} ({`${amount}/${amount}`})
                  </Checkbox>
                ))}
              </Grid.Item>
              <Grid.Item>
                <Divider style={{ borderStyle: "dashed" }} />
              </Grid.Item>

              <Grid.Item>
                <Grid columns={1} gap={14}>
                  <Grid.Item className="text-xs font-medium">
                    {t("public.telegramGroupLink")}&nbsp;
                    <span className="text-white/50">
                      ({t("public.robotBroadcast")})
                    </span>
                  </Grid.Item>
                  <Grid.Item className="grid grid-cols-[1fr,auto] items-center gap-3">
                    <Select
                      value={notify}
                      onChange={(e) => {
                        setNotify(e);
                      }}
                      className="w-full"
                      size="large"
                      placeholder={t("public.enterRobotLink")}
                      options={notifys.data.map((item) => ({
                        label: item.chat_title,
                        value: item.Id,
                      }))}
                    />
                    <Button
                      color="default"
                      className="!h-12 !bg-transparent !border-[--primary] !text-[--primary]"
                      onClick={() => setAddTelegramLinkStatus(true)}
                    >
                      {t("public.add")}
                    </Button>
                  </Grid.Item>
                  <Grid.Item className="text-white/50 text-xs font-normal">
                    {t("task.telegramBotText")}
                  </Grid.Item>
                  {notify ? (
                    <Grid.Item className="pt-4">
                      <Grid columns={1} gap={14}>
                        <Grid.Item className="text-xs font-medium">
                          {t("task.uploadTelegramBotImg.title")}
                        </Grid.Item>
                        <Grid.Item>
                          <ImageUploader
                            value={imgs}
                            onChange={setImgs}
                            upload={async (file) => {
                              setFile(file);
                              return { url: URL.createObjectURL(file) };
                            }}
                          />
                        </Grid.Item>
                        <Grid.Item className="text-white/50 text-xs font-normal">
                          {t("task.uploadTelegramBotImg.text")}
                        </Grid.Item>
                      </Grid>
                    </Grid.Item>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid.Item>
            </>
          ) : (
            <>
              {publishTaskDetails.task.urls
                ? Object.entries(publishTaskDetails.task.urls).map(
                    ([key, item]) => (
                      <Grid.Item>
                        <Card className="!bg-[--primary-card-body-color]">
                          <Grid columns={1} gap={12}>
                            <Grid.Item className="text-base font-bold">
                              <Icon name="tweet" className="!w-5 !h-5 mr-3" />
                              {t(`public.${key}`)}
                            </Grid.Item>
                            <Grid.Item>
                              <Divider />
                            </Grid.Item>
                            <Grid.Item className="text-sm font-normal break-words text-[#F0F0F2]">
                              {item || ""}
                            </Grid.Item>
                          </Grid>
                        </Card>
                      </Grid.Item>
                    )
                  )
                : ""}
              <Grid.Item>
                <Card className="!bg-[--primary-card-body-color]">
                  <Grid columns={1} gap={12}>
                    <Grid.Item className="text-base font-bold">
                      <Icon name="introduction" className="!w-5 !h-5 mr-3" />
                      {t("public.missionIntroduction")}
                    </Grid.Item>
                    <Grid.Item>
                      <Divider />
                    </Grid.Item>
                    <Grid.Item className="text-sm font-normal break-words text-[#F0F0F2]">
                      {publishTaskDetails.task.description}
                    </Grid.Item>
                  </Grid>
                </Card>
              </Grid.Item>
              <Grid.Item>
                <Card className="!bg-[--primary-card-body-color] !py-5">
                  <Grid columns={1} gap={26}>
                    <Grid.Item className="text-base font-bold">
                      <Icon name="list" className="!w-5 !h-5 mr-3" />
                      {t("public.checklist")}
                    </Grid.Item>
                    <Grid.Item>
                      <Divider />
                    </Grid.Item>
                    <Grid.Item>
                      <Grid columns={1} gap={26}>
                        {publishTaskDetails.models.map((item) => (
                          <Grid.Item className="flex items-center gap-2 justify-between text-xs font-normal">
                            <span className="text-[#8C91A2]">
                              {t(`public.${item.model}`)}
                            </span>
                            <span>
                              {Number(item.max) - Number(item.current)}/
                              {Number(item.max)}
                            </span>
                          </Grid.Item>
                        ))}
                      </Grid>
                    </Grid.Item>
                  </Grid>
                </Card>
              </Grid.Item>
            </>
          )}
        </Grid>
      </Popup>
    </>
  );
}
