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
import { useLocation } from "react-router-dom";

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
import { copy, semicolon, formatAddress } from "@/util";
import { basePair } from "@/util/baseData";
import { Social, Website } from "@/types/dex";
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
      gap={16}
      className={`overflow-y-auto max-h-[calc(100vh-${
        topHeight + 112 + 16 * 4 + 6 * 2
      }px)]`}
    >
      <Grid.Item className="grid grid-cols-[60px,1fr,auto] items-center gap-3">
        <Image
          src={token.pair?.info?.imageUrl || ""}
          className="!h-[60px] !w-[60px] rounded-full"
        />
        <Grid columns={1} gap={2}>
          <Grid.Item className="text-sm font-bold">
            {token.pair?.baseToken.symbol || ""}<span className="opacity-75 text-[75%]"> - SOL</span>
          </Grid.Item>
          <Grid.Item className="text-xl font-bold text-[#F8F9FD] flex items-center gap-2">
            ${token.pair?.priceUsd || 0}
            {token.pair?.priceChange?.h24 !== undefined && (
              <span className={`text-sm ${token.pair.priceChange.h24 >= 0 ? 'text-[--success-color]' : 'text-[--error-color]'}`}>
                {token.pair.priceChange.h24 >= 0 ? '+' : ''}{token.pair.priceChange.h24}%
              </span>
            )}
          </Grid.Item>
        </Grid>
        <div className="w-[40px] h-[40px] bg-[--primary-card-body-color] p-2 rounded-xl flex justify-center items-center">
          <Rate
            count={1}
            value={collect ? 1 : 0}
            onChange={async () => {
              const search = new URLSearchParams(location.search);
              const id = search.get("id");
              if (!id) return;
              await api.favorites.addFavorites({ address: id });
              await api.favorites.isFavorites({ address: id });
              dispatch(asyncFavoritesList({}));
            }}
          />
        </div>
      </Grid.Item>

      {/* 市值和其他信息 */}
      <Grid.Item className="grid grid-cols-2 gap-4">
        {token.pair?.fdv !== undefined && (
          <div className="bg-[--primary-card-body-color] p-3 rounded-xl">
            <div className="text-xs text-[--secondary-text-color]">{t('public.mktCap')}</div>
            <div className="text-base font-medium">${(token.pair?.fdv || 0).toLocaleString()}</div>
          </div>
        )}
        {token.pair?.dexId && (
          <div className="bg-[--primary-card-body-color] p-3 rounded-xl">
            <div className="text-xs text-[--secondary-text-color]">DEX</div>
            <a
              href={`https://raydium.io/swap/?inputMint=sol&outputMint=${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium capitalize hover:text-[--primary-color] flex items-center gap-1"
            >
              {token.pair.dexId}
              <Icon name="link" className="w-4 h-4" />
            </a>
          </div>
        )}
      </Grid.Item>

      {/* 价格变动和交易量表格 */}
      <Grid.Item>
        <div className="bg-[--primary-card-body-color] p-4 rounded-xl">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-[--secondary-text-color]">
                <th className="font-normal text-left pb-2">{t("public.time")}</th>
                <th className="font-normal text-right pb-2">{t("public.priceChange")}</th>
                <th className="font-normal text-right pb-2">{t("public.volume")}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td className="py-2">{t("public.hour1")}</td>
                <td className="text-right">
                  <span className={token.pair?.priceChange?.h1 ? (token.pair.priceChange.h1 >= 0 ? 'text-[--success-color]' : 'text-[--error-color]') : ''}>
                    {token.pair?.priceChange?.h1 ? (token.pair.priceChange.h1 >= 0 ? '+' : '') : ''}{token.pair?.priceChange?.h1 || 0}%
                  </span>
                </td>
                <td className="text-right">${token.pair?.volume?.h1 || 0}</td>
              </tr>
              <tr>
                <td className="py-2">{t("public.hour6")}</td>
                <td className="text-right">
                  <span className={token.pair?.priceChange?.h6 ? (token.pair.priceChange.h6 >= 0 ? 'text-[--success-color]' : 'text-[--error-color]') : ''}>
                    {token.pair?.priceChange?.h6 ? (token.pair.priceChange.h6 >= 0 ? '+' : '') : ''}{token.pair?.priceChange?.h6 || 0}%
                  </span>
                </td>
                <td className="text-right">${token.pair?.volume?.h6 || 0}</td>
              </tr>
              <tr>
                <td className="py-2">{t("public.hour24")}</td>
                <td className="text-right">
                  <span className={token.pair?.priceChange?.h24 ? (token.pair.priceChange.h24 >= 0 ? 'text-[--success-color]' : 'text-[--error-color]') : ''}>
                    {token.pair?.priceChange?.h24 ? (token.pair.priceChange.h24 >= 0 ? '+' : '') : ''}{token.pair?.priceChange?.h24 || 0}%
                  </span>
                </td>
                <td className="text-right">${token.pair?.volume?.h24 || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Grid.Item>

      {/* 社交媒体和网站信息 */}
      {token.pair?.info?.socials && token.pair.info.socials.length > 0 && (
        <Grid.Item className="flex flex-wrap gap-4">
          {[...(token.pair?.info?.socials || [])].sort((a: Social, b: Social) => {
            if (a.platform === 'telegram') return -1;
            if (b.platform === 'telegram') return 1;
            if (a.platform === 'twitter') return -1;
            if (b.platform === 'twitter') return 1;
            return 0;
          }).map((social: Social, index: number) => {
            const type = social.type || social.platform;
            const url = social.url || `https://${social.platform}.com/${social.handle}`;
            return (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={type === 'twitter' || type === 'telegram'
                  ? "w-8 h-8 rounded-full bg-[--primary-card-body-color] flex items-center justify-center"
                  : "text-sm text-[--primary-text-color] bg-[--primary-card-body-color] px-3 py-1 rounded-full"}
              >
                {type === 'twitter' || type === 'telegram' ? (
                  <Icon name={type === 'twitter' ? 'twitter' : 'telegram'} className="w-5 h-5" />
                ) : (
                  type.charAt(0).toUpperCase() + type.slice(1)
                )}
              </a>
            );
          })}
          {/* 网站链接 */}
          {token.pair?.info?.websites?.map((site: Website, index: number) => {
            const getIconName = (label?: string) => {
              if (!label) return 'link';
              const labelLower = label.toLowerCase();
              switch (labelLower) {
                case 'docs':
                  return 'docs';
                case 'tiktok':
                  return 'tiktok';
                case 'website':
                default:
                  return 'officialWebsite';
              }
            };
            
            return (
              <a
                key={index}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2b313b] flex items-center justify-center"
              >
                <Icon name={getIconName(site.label)} className="w-5 h-5" />
              </a>
            );
          })}
        </Grid.Item>
      )}

      {/* 合约信息 */}
      <Grid.Item>
        <Collapse defaultActiveKey={["details"]}>
          <Collapses.Panel key="details" title={t("public.details")}>
            <Grid columns={1} gap={3}>
              <Grid.Item className="flex items-center gap-2 justify-between text-sm">
                <span className="font-normal text-nowrap flex-1 text-[#FFB800]">
                  {t("public.contractAddress")}
                </span>
                <div
                  className="flex items-center gap-2 bg-[--primary-card-body-color] px-3 py-1.5 rounded-xl cursor-pointer hover:bg-[--primary-card-body-hover-color] transition-colors border border-[#FFB800]"
                  onClick={() => {
                    copy(tgs, token.address);
                  }}
                >
                  <Ellipsis
                    className="font-medium text-[#FFB800]"
                    direction="middle"
                    content={formatAddress(token.address)}
                  />
                  <Icon name="copy" className="w-4 h-4 text-[#FFB800]" />
                </div>
              </Grid.Item>
              <Grid.Item>
                <Divider className="my-1" />
              </Grid.Item>
              <Grid.Item className="grid grid-cols-[1fr,auto] text-sm text-white">
                <span className="font-normal">
                  {t("public.pair")}
                </span>
                <a
                  href={`https://dexscreener.com/solana/${token.pair?.pairAddress || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 hover:text-[--primary-color]"
                >
                  <Ellipsis
                    className="font-bold break-all text-end"
                    direction="middle"
                    content={formatAddress(token.pair?.pairAddress || '')}
                  />
                  <Icon name="link" className="w-4 h-4" />
                </a>
              </Grid.Item>
            </Grid>
          </Collapses.Panel>
        </Collapse>
      </Grid.Item>

      {/* 免责声明 */}
      <Grid.Item className="text-xs text-[--secondary-text-color] px-2 text-center">
        {t("public.disclaimer")}
      </Grid.Item>

      <Grid.Item className="fixed left-0 bottom-0 w-full bg-[--primary-bg-color] h-28">
        <Container>
          <Button
            size="large"
            onClick={() => onChange && onChange(1)}
            color="primary"
            className="w-full !text-black"
          >
            <div className="flex items-center justify-center gap-1">
              {`${t("public.vote")} (${token.votes} 🚀)`}
            </div>
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

    console.log('Token Details Data:', {
      tokenData: data,
      pair: data.pair,
      baseToken: data.pair?.baseToken,
      info: data.pair?.info
    });

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
