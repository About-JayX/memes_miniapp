import { Card, Grid, Image, Rate } from "antd-mobile";
import { useTranslation } from "react-i18next";

import api from "@/api";
import { Pair } from "@/api/dex";
import { Container } from "@/components/box";
import InfiniteScroll from "@/components/infiniteScroll";
import Toast from "@/components/toast";
import { useAppDispatch, useAppSelector } from "@/store";
import { IFavorite, ItokenData } from "@/store/interface";
import { asyncFavoritesList } from "@/store/list";
import { asyncLoading } from "@/store/telegram";
import { basePair } from "@/util/baseData";

export const CollectItem = ({
  data = { base: basePair },
}: {
  data: IFavorite;
}) => {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.list);
  const { tgs } = useAppSelector((state) => state.tgs);
  const { t } = useTranslation();

  return (
    <>
      {data.base ? (
        <Card className="!bg-[--primary-card-body-color]">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex gap-[10px]">
              <Image
                src={data.base.logo || ""}
                className="!w-[40px] !h-[40px] rounded-lg"
              />
              <Grid columns={1} gap={1}>
                <span className="text-sm font-bold">{data.base.name}</span>
                <span className="text-[10px] font-medium">
                  {data.base.symbol}
                </span>
              </Grid>
            </div>
            <Rate
              count={1}
              value={1}
              onChange={async () => {
                try {
                  await dispatch(
                    asyncLoading({
                      globalText: t("public.loading"),
                      callBack: async () => {
                        await api.favorites.delFavorites({
                          address: data.base.address,
                        });
                        await dispatch(
                          asyncFavoritesList({
                            page: 1,
                            pageSize:
                              (favorites.page - 1 ? favorites.page - 1 : 1) *
                              favorites.pageSize,
                          })
                        );
                      },
                    })
                  );
                  Toast({
                    tgs,
                    type: "success",
                    content: t("message.operate.success"),
                  });
                } catch (error) {
                  console.log(error, "error_");
                }
              }}
              style={{ "--star-size": "20px" }}
            />
          </div>
        </Card>
      ) : (
        ""
      )}
    </>
  );
};

export default function Collect() {
  const { t } = useTranslation();
  const { favorites } = useAppSelector((state) => state.list);
  const dispatch = useAppDispatch();
  const getCollectData = async () => {
    if (favorites.data.length >= Number(favorites.total)) return;

    if (favorites.data.length) {
      await dispatch(asyncFavoritesList({}));
    }
  };
  return (
    <Container className={`overflow-hidden h-[calc(100vh-3rem)] pb-12`}>
      <Grid columns={1} gap={20}>
        <Grid.Item className="text-base font-bold text-center">
          {t("public.myCollection")}
        </Grid.Item>
        <Grid.Item>
          <InfiniteScroll
            data={favorites.data}
            height={window.innerHeight - (24 + 20 + 16 *2)}
            itemSize={80}
            loadMore={getCollectData}
            count={Number(favorites.total)}
            render={({ index, data }) => <CollectItem data={data[index]} />}
          />
        </Grid.Item>
      </Grid>
    </Container>
  );
}
