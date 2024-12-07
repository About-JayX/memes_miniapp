import {
  Button,
  CapsuleTabs,
  Collapse as Collapses,
  Divider,
  Ellipsis,
  Grid,
  Image,
  Rate,
} from "antd-mobile";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

import api from "@/api";
import { Container } from "@/components/box";
import Collapse from "@/components/collapse";
import Icon from "@/components/icon";
import Vote from "@/components/lib/vote";
import Toast from "@/components/toast";
import { useAppDispatch, useAppSelector } from "@/store";
import { ItokenData } from "@/store/interface";
import { asyncFavoritesList } from "@/store/list";
import { asyncLoading } from "@/store/telegram";
import { copy, semicolon } from "@/util";
import { basePair } from "@/util/baseData";
// 项目信息
export const ProjectInformation = ({
  topHeight = 0,
  onChange,
  token = basePair,
}: {
  topHeight?: number;
  onChange?: (id: number) => void;
  token: ItokenData;
}) => {
  const { t } = useTranslation();
  const [collect, setCollect] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { favorites, tokens } = useAppSelector((state) => state.list);
  const { tgs } = useAppSelector((state) => state.tgs);

  const isFavorites = async () => {
    const search = new URLSearchParams(location.search);
    const id = search.get("id");
    const result = await api.favorites.isFavorites({ address: id || "" });
    setCollect(result);
  };

  useEffect(() => {
    if (!location.search) return;
    isFavorites();
  }, [location]);

  return (
    <Grid
      columns={1}
      gap={26}
      className={`overflow-y-auto max-h-[calc(100vh-${
        topHeight + 112 + 16 * 4 + 6 * 2
      }px)]`}
    >
      <Grid.Item className="grid grid-cols-[60px,1fr,auto] items-center gap-3">
        <Image
          src={token.pair?.info?.imageUrl || ""}
          className="!h-[60px] !w-[60px] rounded-xl"
        />
        <Grid columns={1} gap={2}>
          <Grid.Item className="text-xs font-bold">
            {token.pair?.baseToken.name || ""}{" "}
            {token.pair?.baseToken.symbol || ""}
          </Grid.Item>
          <Grid.Item className="text-2xl font-bold text-[#F8F9FD]">
            ${token.pair?.priceUsd || 0}
          </Grid.Item>
          <Grid.Item className="text-xs font-medium flex gap-2 text-[#CED0D8]">
            <span
              className={`text-[--${
                (token.pair?.priceChange.h24 || 0) > 0 ? "success" : "error"
              }-color] flex items-center gap-1`}
            >
              <Icon
                name={`quotes/${
                  (token.pair?.priceChange.h24 || 0) > 0 ? "up" : "down"
                }`}
                className="w-[12px] h-[12px]"
              />
              {token.pair?.priceChange.h24 || 0} %
            </span>
            {t("public.past24hours")}
          </Grid.Item>
        </Grid>
        <div className="w-[40px] h-[40px] bg-[--primary-card-body-color] p-2 rounded-xl flex justify-center items-center">
          <Rate
            count={1}
            value={collect ? 1 : 0}
            onChange={async () => {
              try {
                await dispatch(
                  asyncLoading({
                    globalText: t("public.loading"),
                    callBack: async () => {
                      collect
                        ? await api.favorites.delFavorites({
                            address: token.address,
                          })
                        : await api.favorites.addFavorites({
                            address: token.address,
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
                  content: collect
                    ? t("message.del.success")
                    : t("message.add.success"),
                });

                setCollect(!collect);
              } catch (error) {
                Toast({
                  tgs,
                  type: "error",
                  content: collect
                    ? t("message.del.fail")
                    : t("message.add.fail"),
                });
              }
            }}
            style={{ "--star-size": "20px" }}
          />
        </div>
      </Grid.Item>
      <Grid.Item>
        <Grid columns={1} gap={16}>
          {/* <Grid.Item className="grid grid-cols-[1fr,auto] gap-2 items-center">
            <span className="text-base font-bold">About Bitcoin</span>
            <span className="text-sm font-medium text-[--primary]">
              {t('public.seeAll')}
            </span>
          </Grid.Item>
          <Grid.Item>
            <Divider />
          </Grid.Item> */}
          {/* <Grid.Item>
            <Grid columns={1} gap={8}>
              <Grid.Item className="text-xs font-bold">
                What is Bitcoin(BTC)?
              </Grid.Item>
              <Grid.Item className="text-xs font-normal">
                Bitcoin is a decentralized cryptocurrency originally described
                in a 2008 whitepaper by a person or group of people, using the
                alias Satoshi Nakamoto. It was launched soon after, in January
                2009.
              </Grid.Item>
              <Grid.Item className="mt-2">
                <div className="flex flex-wrap gap-3">
                  <a className="w-[40px] h-[40px] bg-[--primary-card-body-color] rounded-xl flex justify-center items-center">
                    <Icon name="twitter" />
                  </a>
                  <a className="w-[40px] h-[40px] bg-[--primary-card-body-color] rounded-xl flex justify-center items-center">
                    <Icon name="telegram" />
                  </a>
                  <a className="w-[40px] h-[40px] bg-[--primary-card-body-color] rounded-xl flex justify-center items-center">
                    <Icon name="officialWebsite" />
                  </a>
                </div>
              </Grid.Item>
            </Grid>
          </Grid.Item> */}
        </Grid>
      </Grid.Item>
      <Grid.Item>
        <Collapse defaultActiveKey={["details"]}>
          <Collapses.Panel key="details" title={t("public.details")}>
            <Grid columns={1} gap={14}>
              <Grid.Item className="flex items-center gap-2 justify-between text-sm text-white">
                <span className="font-normal text-nowrap flex-1">
                  {t("public.contractAddress")}
                </span>
                <div
                  className="flex gap-2"
                  onClick={() => {
                    copy(tgs, token.address);
                  }}
                >
                  <Ellipsis
                    className="font-bold break-all text-end"
                    direction="middle"
                    content={token.address}
                  />
                  <Icon name="copy" />
                </div>
              </Grid.Item>
              <Grid.Item>
                <Divider />
              </Grid.Item>
              <Grid.Item className="grid grid-cols-[1fr,auto] text-sm text-white">
                <span className="font-normal">{t("public.fdv")}</span>
                <span className="font-bold">
                  ${semicolon(token.pair?.fdv || 0)}
                </span>
              </Grid.Item>
              <Grid.Item>
                <Divider />
              </Grid.Item>
              <Grid.Item className="grid grid-cols-[1fr,auto] text-sm text-white">
                <span className="font-normal">{t("public.mktCap")}</span>
                <span className="font-bold">
                  ${semicolon(token.pair?.fdv || 0)}
                </span>
              </Grid.Item>
              <Grid.Item>
                <Divider />
              </Grid.Item>
              <Grid.Item className="grid grid-cols-[1fr,auto] text-sm text-white">
                <span className="font-normal">
                  {t("public.twentyFourHVol")}
                </span>
                <span className="font-bold">
                  ${token.pair?.volume.h24 || 0}
                </span>
              </Grid.Item>
              <Grid.Item>
                <Divider />
              </Grid.Item>
              {/* <Grid.Item className="grid grid-cols-[1fr,auto] text-sm text-white">
                <span className="font-normal">{t('public.holders')}</span>
                <span className="font-bold">{semicolon(10)}</span>
              </Grid.Item>
              <Grid.Item>
                <Divider />
              </Grid.Item> */}
              <Grid.Item className="grid grid-cols-[1fr,auto] text-sm text-white">
                <span className="font-normal">{t("public.pair")}</span>
                <span className="font-bold">
                  {token.pair?.quoteToken.name || ""}
                </span>
              </Grid.Item>
            </Grid>
          </Collapses.Panel>
        </Collapse>
      </Grid.Item>
      <Grid.Item className="fixed left-0 bottom-0 w-full bg-[--primary-bg-color] h-28">
        <Container>
          <Button
            size="large"
            onClick={() => onChange && onChange(1)}
            color="default"
            className="!bg-[#2b313b] !border-[2px] !border-[#2b313b] relative overflow-hidden w-full"
          >
            <span className="opacity-0">{t("public.vote")}</span>
            <span className="absolute left-0 top-0 w-full h-full flex items-center justify-center z-10">
              {`${t("public.vote")} (${token.votes})`}
            </span>
            <div
              className="absolute left-0 top-0 h-full bg-[--primary]"
              style={{ width: `${(token.votes / tokens.data.votes) * 100}%` }}
            />
          </Button>
        </Container>
      </Grid.Item>
    </Grid>
  );
};

//K线图
export const KLineChart = ({
  data = basePair,
  topHeight = 0,
}: {
  data: ItokenData;
  topHeight?: number;
}) => {
  return (
    <iframe
      src={`https://dexscreener.com/solana/${data.address}?embed=1&theme=dark&info=0`}
      className={`w-full h-[calc(100vh-${topHeight + 16 * 4 + 12 * 2}px)]`}
    />
  );
};

export default function Details() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("projectInformation");
  const [topHeight, setTopHeight] = useState<number>(0);
  const [voteStatus, setVoteStatus] = useState<boolean>(false);
  const { tokens, search: searchs } = useAppSelector((state) => state.list);
  const [token, setToken] = useState<ItokenData>(basePair);
  const topRef = useRef<HTMLDivElement>(null);

  const init = () => {
    if (!location.search || !tokens.data.bases.length) return;
    const search = new URLSearchParams(location.search);
    const id = search.get("id");

    const arr = [...tokens.data.bases, ...searchs];
    const data = arr.find((item) => item.address === id) || token;

    setToken(data);
  };
  useEffect(() => {
    init();
  }, [location, tokens]);
  useLayoutEffect(() => {
    if (topRef.current) {
      const height = topRef.current.getBoundingClientRect().height;
      setTopHeight(height);
    }
  }, []);
  return (
    <>
      <Vote
        open={voteStatus}
        voteData={token}
        onChange={async () => {
          const result = await api.vote.userPointRank({
            address: token.address,
          });
          if (!result.success) return Promise.reject(result.message);
        }}
        onClose={() => setVoteStatus(false)}
      />
      <Container>
        <Grid columns={1} gap={20}>
          <Grid.Item>
            <CapsuleTabs
              activeKey={tab}
              defaultActiveKey={tab}
              onChange={setTab}
            >
              <CapsuleTabs.Tab
                title={t("public.projectInformation")}
                key="projectInformation"
              />
              <CapsuleTabs.Tab
                title={t("public.kLineChart")}
                key="kLineChart"
              />
            </CapsuleTabs>
          </Grid.Item>
          <Grid.Item>
            {tab === "projectInformation" ? (
              <ProjectInformation
                token={token}
                topHeight={topHeight}
                onChange={() => {
                  setVoteStatus(true);
                }}
              />
            ) : (
              <KLineChart topHeight={topHeight} data={token} />
            )}
          </Grid.Item>
        </Grid>
      </Container>
    </>
  );
}
