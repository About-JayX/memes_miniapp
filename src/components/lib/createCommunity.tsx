import { Button, Grid, type ImageUploadItem, TextArea } from "antd-mobile";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import ImageUploader from "../imageUploader";
import Input from "../input";
import Popup from "../popup";

export default function CreateCommunity({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const [avatar, setAvatar] = useState<ImageUploadItem[]>([]);
  const [bg, setBg] = useState<ImageUploadItem[]>([]);
  const { t } = useTranslation();
  return (
    <Popup
      visible={open}
      onClose={onClose}
      footer={
        <Button size="large" color="primary" className="w-full">
          {t("public.completeGroupSetup")}
        </Button>
      }
    >
      <Grid columns={1} gap={26} className="popup-grid">
        <Grid.Item className="w-full">
          <Grid columns={1} gap={27} className="grid justify-items-center">
            <Grid.Item className="w-full text-center">
              <Grid columns={1} gap={8}>
                <Grid.Item className="text-2xl font-bold">
                  {t("community.create.title")}
                </Grid.Item>
                <Grid.Item className="text-base font-normal">
                  {t("community.create.text")}
                </Grid.Item>
              </Grid>
            </Grid.Item>
            <Grid.Item className="w-full flex flex-col ">
              <Grid columns={1} gap={14}>
                <Grid.Item className="text-xs font-medium">
                  {t("public.groupName")}&nbsp;
                  <span className="text-[--error-color]">*</span>
                </Grid.Item>
                <Grid.Item>
                  <Input />
                </Grid.Item>
              </Grid>
            </Grid.Item>
            <Grid.Item className="w-full flex flex-col ">
              <Grid columns={1} gap={14}>
                <Grid.Item className="text-xs font-medium">
                  {t("public.contractAddress")}&nbsp;
                  <span className="text-[--error-color]">*</span>
                </Grid.Item>
                <Grid.Item>
                  <Input placeholder="Enter wallet address" />
                </Grid.Item>
                <Grid.Item className="text-white/50 text-xs font-normal">
                  {t("community.create.contractAddressText")}
                </Grid.Item>
              </Grid>
            </Grid.Item>
            <Grid.Item className="w-full flex flex-col ">
              <Grid columns={1} gap={14}>
                <Grid.Item className="text-xs font-medium">
                  {t("public.groupIntroduction")}&nbsp;
                  <span className="text-[--error-color]">*</span>
                </Grid.Item>
                <Grid.Item>
                  <TextArea />
                </Grid.Item>
              </Grid>
            </Grid.Item>
            <Grid.Item className="w-full flex flex-col ">
              <Grid columns={1} gap={14}>
                <Grid.Item className="text-xs font-medium">
                  {t("public.groupAvatar")}&nbsp;
                  <span className="text-[--error-color]">*</span>
                </Grid.Item>
                <Grid.Item>
                  <ImageUploader
                    value={avatar}
                    onChange={setAvatar}
                    upload={async (file) => {
                      return { url: URL.createObjectURL(file) };
                    }}
                  />
                </Grid.Item>
              </Grid>
            </Grid.Item>
            <Grid.Item className="w-full flex flex-col ">
              <Grid columns={1} gap={14}>
                <Grid.Item className="text-xs font-medium">
                  {t("public.groupBackground")}&nbsp;
                  <span className="text-[--error-color]">*</span>
                </Grid.Item>
                <Grid.Item className="w-full">
                  <ImageUploader
                    value={bg}
                    onChange={setBg}
                    upload={async (file) => {
                      return { url: URL.createObjectURL(file) };
                    }}
                  />
                </Grid.Item>
              </Grid>
            </Grid.Item>
          </Grid>
        </Grid.Item>
      </Grid>
    </Popup>
  );
}
