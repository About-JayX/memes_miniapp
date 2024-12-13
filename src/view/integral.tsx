import { Button, Grid } from "antd-mobile";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/box";
import InfiniteScroll from "@/components/infiniteScroll";
import { symbol } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store";
import { asyncDetailsList } from "@/store/list";
import { semicolon } from "@/util";

export const PointsDetails = () => {
  const { t } = useTranslation();
  const { points } = useAppSelector((state) => state.list);
  const { user } = useAppSelector((state) => state.telegram);
  const dispatch = useAppDispatch();
  const getPointsData = async () => {
    if (points.data.length >= points.total) return;
    await dispatch(asyncDetailsList({}));
  };
  return (
    <Grid columns={1} gap={24} className="justify-items-center text-center">
      <Grid.Item>
        <Grid columns={1} gap={2}>
          <Grid.Item className="text-xs font-bold">
            {t("public.toGainPoints")}
          </Grid.Item>
          <Grid.Item className="text-4xl font-bold">
            {semicolon(user.token)} ${symbol}
          </Grid.Item>
        </Grid>
      </Grid.Item>
      <Grid.Item>
        <Grid columns={1} gap={4}>
          <Grid.Item className="text-2xl font-bold">
            {t("integral.title")}
          </Grid.Item>
          <Grid.Item className="text-base font-normal text-white/50">
            {t("integral.text")}
          </Grid.Item>
        </Grid>
      </Grid.Item>
      <Grid.Item className="w-full">
        <Grid columns={1} gap={16}>
          <Grid.Item className="text-left text-base font-bold">
            {t("public.pointsRecord")}
          </Grid.Item>
          <InfiniteScroll
            height={window.innerHeight - (58 + 84 + 24 + 24 * 2 + 16)}
            data={points.data}
            loadMore={getPointsData}
            count={points.total}
            itemSize={54}
            render={({ index, data }) => (
              <Grid.Item
                className="flex gap-2 items-center justify-between"
                key={index}
              >
                <Grid columns={1} gap={2} className="text-left">
                  <Grid.Item className="text-sm font-bold">
                    {t(
                      `integral.${data[index].title
                        ?.replace(/\s*/g, "")
                        ?.replace(
                          data[index].title[0],
                          data[index].title[0].toLowerCase()
                        )}`
                    )}
                  </Grid.Item>
                  <Grid.Item className="text-xs font-normal text-[#F0F0F2]">
                    {data[index].time}
                  </Grid.Item>
                </Grid>
                <Button className="!text-[#A6A6A6]">
                  {data[index].type ? "+" : "-"}
                  {semicolon(data[index].amount)}
                </Button>
              </Grid.Item>
            )}
          />
        </Grid>
      </Grid.Item>
    </Grid>
  );
};

export default function Integral() {
  return (
    <Container className="h-screen overflow-hidden">
      <PointsDetails />
    </Container>
  );
}
