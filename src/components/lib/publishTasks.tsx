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

export default function PublishTasks({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  useEffect(() => {
    if(open) {
      window.location.href = 'https://t.me/MINIDOGE_PORTAL';
      onClose && onClose();
    }
  }, [open]);

  return null;
}
