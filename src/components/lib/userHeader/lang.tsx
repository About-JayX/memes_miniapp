import { Card, Grid } from "antd-mobile";
import { useTranslation } from "react-i18next";

import Popup from "@/components/popup";
import locale from "@/config/locale";

export default function Lang({
  open = false,
  onClose,
  loading = false
}: {
  open?: boolean;
  loading?: boolean;
  onClose?: () => void;
}) {
  const { t, i18n } = useTranslation();
  return (
    <Popup
      visible={open}
      onClose={onClose}
      title={t("lang")}
      className={`${loading ? "!h-screen !z-[9999]" : ""}`}
    >
      <Grid columns={1} gap={12}>
        {Object.entries(locale).map(([key, value]: any) => (
          <Grid.Item
            key={key}
            onClick={() => {
              i18n.changeLanguage(key);
              onClose && onClose();
            }}
          >
            <Card
              className={`text-sm font-medium border border-transparent !bg-[--primary-card-body-color] ${
                key === i18n.language
                  ? "text-[--primary] !border-[--primary]"
                  : ""
              }`}
            >
              {value.translation.language}
            </Card>
          </Grid.Item>
        ))}
      </Grid>
    </Popup>
  );
}
