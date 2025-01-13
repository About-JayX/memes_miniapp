// import { useRequest } from 'ahooks'
import {
  Button,
  Ellipsis,
  Grid,
  type GridItemProps,
  Image,
  InfiniteScroll as InfiniteScrolls,
} from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import api from "@/api";
import { searchTokensAPI, updatePairsAPI } from "@/api/data";
import {
  ChainId,
  getPairByTokens,
  Pair,
  PairsResponse,
  searchTokens,
} from "@/api/dex";
import Box, { Container } from "@/components/box";
import MButton from "@/components/button";
import MemesCard from "@/components/card";
import Card from "@/components/card";
// import CapsuleTabsC from '@/components/capsuleTabs'
import InfiniteScroll from "@/components/infiniteScroll";
// import Input from "@/components/input";
import UserHeader from "@/components/lib/userHeader";
import Vote from "@/components/lib/vote";
import Search from "@/components/search";
import TgsAnimation from "@/components/tgsAnimation";
import { symbol } from "@/config";
// import { pollingData } from "@/hooks/initData";
import { useAppDispatch, useAppSelector } from "@/store";
import { ItokenData } from "@/store/interface";
import {
  asyncGetTokenList,
  asyncSearchList,
  asyncUploadTimeOut,
  updateSearchs,
  updateToken,
} from "@/store/list";
import { asyncPollingToken, updateItemRefs } from "@/store/polling";
import { isTimeExceededByOneMinute, semicolon } from "@/util";
import { basePair } from "@/util/baseData";

// 投票组件
export const Votes = ({
  data = basePair,
  onChange,
  ...props
}: {
  data?: ItokenData | null;
  uPstatus?: boolean;
  onChange?: (item: number) => void;
} & GridItemProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tokens } = useAppSelector((state) => state.list);

  return (
    <Grid.Item {...props} >
      <Card animation={false}>
        <div className="grid grid-flow-col grid-cols-[3fr] !items-center !justify-between gap-3">
          {/* 代币信息 */}
          <Grid.Item
            onClick={() => {
              if (!data?.pair) return;
              navigate(`/list/details?id=${data?.address || ""}`, {
                state: { path: "/" },
              });
            }}
          >
            <div className="grid grid-flow-col !grid-cols-[40px,1fr] items-center gap-3">
              <Image
                src={data?.pair?.info?.imageUrl || data?.logo || ""}
                className="!w-[40px] !h-[40px] rounded-full"
              />
              <Grid columns={1} gap={2} className="text-left">
                <Grid.Item className="text-sm font-bold flex gap-1">
                  <Ellipsis
                    direction="end"
                    content={data?.pair?.baseToken.symbol || data?.symbol || ""}
                    className="flex-1"
                  />
                </Grid.Item>
                <Grid.Item
                  className={`text-xs font-medium grid grid-flow-col !grid-cols-[repeat(10px,1fr)] items-center gap-1 opacity-50`}
                >
                  <Ellipsis
                    direction="end"
                    content={data?.pair?.baseToken.name || data?.name || ""}
                  />
                </Grid.Item>
              </Grid>
            </div>
          </Grid.Item>

          {/*  代币价格 */}
          <Grid.Item
            onClick={() => {
              if (!data?.pair) return;
              navigate(`/list/details?id=${data?.address || ""}`, {
                state: { path: "/" },
              });
            }}
          >
            <Grid columns={1} gap={2} className="text-end justify-items-end">
              <Grid.Item className="text-sm font-bold">
                {data?.pair ? <>{data?.pair?.priceUsd || 0} $</> : <>---</>}
              </Grid.Item>
              <Grid.Item
                className={`text-xs w-fit font-medium ${
                  true ? "text-[--success-color]" : "text-[--error-color]"
                } grid grid-flow-col !grid-cols-[repeat(10px,1fr)] items-center gap-1`}
              >
                {/* <Icon
                  name={`${uPstatus ? 'quotes/up' : 'quotes/down'}`}
                  className="w-[10px] h-[10px]"
                /> */}
                {data?.pair ? (
                  <>
                    {" "}
                    🚀 {data?.votes || 0}
                  </>
                ) : (
                  <>---</>
                )}
              </Grid.Item>
            </Grid>
          </Grid.Item>
          {/* 投票按钮 */}
          <Grid.Item className="flex justify-end">
            <>
              <Button
                size="mini"
                onClick={() => onChange && onChange(1)}
                disabled={!data?.pair}
                color="default"
                className="!font-medium !border-[2px] !bg-[var(--vote-button-bg)] !border-[var(--vote-button-border)] !text-[var(--vote-button-text)] relative overflow-hidden min-w-[70px]"
              >
                <div
                  className="absolute z-0 top-0 left-0 h-full bg-[--primary]"
                  style={{
                    width: `${((data?.votes || 0) / tokens.data.votes) * 100}%`,
                  }}
                ></div>
                <span className="opacity-0">{t("public.vote")}</span>
                <span className="absolute z-0 top-0 left-0 flex w-full h-full justify-center items-center">
                  {data?.pair ? t("public.vote") : "no pair"}
                </span>
              </Button>
            </>
          </Grid.Item>
        </div>
      </Card>
    </Grid.Item>
  );
};

export default function List() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const [voteCount, setVoteCount] = useState<number>(0)
  const [voteStatus, setVoteStatus] = useState<boolean>(false);
  const location = useLocation();
  const [voteData, setVoteData] = useState<ItokenData | null>(basePair);
  // const [tab, setTab] = useState<string>('day')
  // const [tabStatus, setTabStatus] = useState<boolean>(true)
  const [page, setPage] = useState(1);
  const pageSize = useRef(20);
  const [searchData, setSearchdata] = useState<any>([]);
  const [searchStatus,setSearchStatus] = useState<boolean>(false)
  const [searchLoadStatus,setSearchLoadStatus] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAppSelector((state) => state.telegram);
  const dispatch = useAppDispatch();
  const { tokens } = useAppSelector((state) => state.list);
  const loadlock = useRef(true);
  // const refs = useRef<any>([])
  // const timer = useRef<any>(null)
  // let pollingData = () => {
  //   if (timer.current) {
  //     clearInterval(timer.current)
  //     timer.current = null
  //   }

  //   timer.current = setInterval(async () => {
  //     const scrollBody = document.querySelector('.scroll-container')
  //     const searchBody = document.querySelector('.search-bar')
  //     let scrollBodyTop = scrollBody?.getBoundingClientRect().top || 0
  //     let searchBodyHeight = searchBody?.getBoundingClientRect().height || 0
  //     let scrollBodyscroll = scrollBody?.scrollTop || 0
  //     const fixeds: Array<any> = refs.current.map(
  //       (item: HTMLElement, index: number) => {
  //         const itemTop =
  //           item.getBoundingClientRect().top - searchBodyHeight - scrollBodyTop
  //         const fixedHeight = itemTop + scrollBodyscroll
  //         return { height: fixedHeight, index }
  //       }
  //     )
  //     let diff: any = null
  //     const diffResult: { height: number; index: number } = fixeds.reduce(
  //       (
  //         acc: { height: number; index: number },
  //         item: { height: number; index: number }
  //       ) => {
  //         if (!diff) {
  //           diff = Math.abs(scrollBodyscroll - item.height)
  //           return item
  //         }
  //         if (diff > Math.abs(scrollBodyscroll - item.height)) {
  //           diff = Math.abs(scrollBodyscroll - item.height)
  //           return item
  //         }
  //         return acc
  //       },
  //       {}
  //     )
  //     // 获取需要更新队列
  //     await dispatch(asyncPollingToken(diffResult.index))
  //   }, 90000)
  // }

  useEffect(() => {
    // pollingData()
    return () => {
      dispatch(
        updateToken({
          page: 1,
          pageSize: tokens.pageSize,
          data: {
            bases: [],
            votes: tokens.data.votes,
          },
          total: 99999,
        })
      );
    };
  }, []);
  // 获取投票数据
  const getVoteData = async () => {
    // if (pollingTimer) {
    //   clearTimeout(pollingTimer)
    //   await dispatch(asyncUploadTimeOut(null))
    // }
    // if (!pollingTimer && tokens.data.data.length) {
    await dispatch(asyncGetTokenList({}));
    // await pollingData(pollingTimer, dispatch, tokens);
    // }
  };
  const loadSearch = async (search?: string, pageParams?: number) => {
    if (!search) return;
    setSearchValue(search);
    const result = await searchTokensAPI({
      page: pageParams ? pageParams : page,
      pageSize: pageSize.current,
      search,
    });

    if (result.length < pageSize.current) {
      setHasMore(false);
    }
    pageParams ? setPage(pageParams + 1) : setPage(page + 1);
    let parsePairs = result.map((item: any) => {
      item.pair = item.pair
        ? JSON.parse(item.pair as unknown as string)
        : item.pair;
      return item;
    });

    // 构建需要请求pair的列表
    const requestPairs: Array<Promise<PairsResponse>> = parsePairs
      .filter((item: any) => {
        return (
          !item.pair || isTimeExceededByOneMinute(item.pair.timestamp || 0)
        );
      })
      .map((item: any) => getPairByTokens(item.address));

    const pairs = (await Promise.all(requestPairs)).reduce(
      (acc: { [key: string]: Pair | undefined }, pairs: PairsResponse) => {
        const tokenAddress = pairs.address;
        const maxPair =
          pairs &&
          pairs.pairs?.reduce((result: Pair, pair: Pair) => {
            if (pair && pair.baseToken.address === tokenAddress) {
              return (result.fdv || 0) > (pair.fdv || 0) ? result : pair;
            }
            return result;
          }, basePair.pair);
        maxPair && (acc[tokenAddress] = maxPair);
        return acc;
      },
      {}
    );
    const updatePairs = Object.values(pairs);
    if (updatePairs.length) {
      const timestamp = new Date().getTime();
      // 更新列表数据
      parsePairs = parsePairs.map((item: any) => {
        const o = updatePairs.find(
          (pair) => pair?.baseToken.address === item.address
        );
        if (!o) return item;

        item.pair = o;
        return item;
      });
      updatePairsAPI(updatePairs.map((item) => ({ ...item, timestamp })));
    }

    const searchs = parsePairs.filter((item: any) => item.pair);

    setSearchdata(pageParams ? searchs : [...searchData, ...searchs]);
    dispatch(updateSearchs(pageParams ? searchs : [...searchData, ...searchs]));
    // const ids = result
    //   .map(item => {
    //     if (item.BasePairs && item.BasePairs.length) {
    //       return item.BasePairs[0].id
    //     }
    //     return null
    //   })
    //   .filter(item => item)
    // const promises = ids.map(item => {
    //   return new Promise(async re => {
    //     try {
    //       const result = await api.data.tokenDetailAPI(item)
    //       re(result)
    //     } catch (error) {
    //       re(null)
    //     }
    //   })
    // })
    // const details = await Promise.all(promises)
    // const ls = details
    //   .filter((item: any) => item && item.length)
    //   .map((item: any) => item[0])
  };
  const [viewStatus, setViewStatus] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [searchBodyHeight, setSearchBodyHeight] = useState(0);
  return (
    <div className="home h-full">
      <Vote
        voteData={voteData}
        open={voteStatus}
        onClose={() => setVoteStatus(false)}
        onChange={async () => {
          const result = await api.vote.userPointRank({
            address: voteData?.pair?.baseToken.address || "",
          });
          if (!result.success) return Promise.reject(result.message);
        }}
      />
      <Box
        viewStatus={viewStatus}
        onViewStatus={setViewStatus}
        onBodyHeight={(e) => setBodyHeight(e)}
        header={
          <Container className="py-0">
            <UserHeader />
          </Container>
        }
        body={
          <MemesCard type="primary">
            <Grid columns={1} gap={18}>
              <Grid.Item>
                <Grid columns={1} gap={4} className="justify-items-center">
                  <Grid.Item className="flex gap-2 items-center break-all">
                    <Ellipsis
                      direction="end"
                      className="text-base font-medium"
                      content={`@${user.username}`}
                    />
                    <a
                      className="text-[10px] font-bold bg-white/5 py-[3px] px-2 rounded-full text-[#4FFFC4]"
                      onClick={() =>
                        !searchLoadStatus && navigate("integral", {
                          state: { path: "/" },
                        })
                      }
                    >
                      {t("public.details")}
                      {">>"}
                    </a>
                  </Grid.Item>
                  <Grid.Item className="text-3xl font-bold">
                    {semicolon(user.token || "0") + ` $${symbol}`}
                  </Grid.Item>
                </Grid>
              </Grid.Item>
              <Grid.Item>
                <Grid columns={2} gap={8}>
                  <Grid.Item>
                    <MButton
                      // size="large"
                      // className="relative w-full !bg-white/1"
                      // color="default"
                      onClick={() =>
                        !searchLoadStatus && navigate("signin", {
                          state: { path: "/" },
                        })
                      }
                    >
                      <div className="absolute left-0 top-0 w-full h-full flex justify-end">
                        <TgsAnimation
                          icon="animate"
                          className="w-8 h-8 text-[--primary] mt-[-3px] mr-[0] inline-block"
                        />
                      </div>

                      <Grid
                        columns={1}
                        gap={2}
                        className="justify-items-center py-2"
                      >
                        <Grid.Item>
                          <TgsAnimation
                            icon="signIn"
                            className="w-10 h-10 text-[--primary] mt-[-6px] inline-block"
                          />
                        </Grid.Item>
                        <Grid.Item>{t("public.dailyCheckIn")}</Grid.Item>
                      </Grid>
                    </MButton>
                  </Grid.Item>
                  <Grid.Item>
                    <MButton
                      // size="large"
                      // color="default"
                      // className="relative w-full !bg-white/1"
                      onClick={() =>!searchLoadStatus &&
                        navigate("invite", {
                          state: { path: "/" },
                        })
                      }
                    >
                      <div className="absolute left-0 top-0 w-full h-full flex justify-end">
                        <TgsAnimation
                          icon="animate"
                          className="w-8 h-8 text-[--primary] mt-[-3px] mr-[0px] inline-block"
                        />
                      </div>
                      <Grid
                        columns={1}
                        gap={2}
                        className="justify-items-center py-2"
                      >
                        <Grid.Item>
                          <TgsAnimation
                            icon="friends"
                            className="w-10 h-10 text-[--primary] mt-[-6px] inline-block"
                          />
                        </Grid.Item>
                        <Grid.Item>{t("public.inviteFriends")}</Grid.Item>
                      </Grid>
                    </MButton>
                  </Grid.Item>
                </Grid>
              </Grid.Item>
            </Grid>
          </MemesCard>
        }
      >
        <div className="search-bar absolute z-10 w-full ">
          <Container className="pt-0 pb-2">
            <Grid columns={1} gap={20}>
              <Grid.Item>
                <Search
                  viewStatus={viewStatus}
                  placeholder={t("public.search")}
                  onBodyHeight={(e) => setSearchBodyHeight(e)}
                  onStatus={setSearchStatus}
                  onSearchLoadStatus={setSearchLoadStatus}
                  onChange={async (search: string) => {
                    loadlock.current = true;
                    setHasMore(true);
                    if (!search) return;
                    await loadSearch(search, 1);
                    loadlock.current = false;
                  }}
                  content={
                    <InfiniteScroll
                      
                      height={
                        bodyHeight > 0
                          ? bodyHeight - 55 * 2
                          : window.innerHeight
                      }
                      itemSize={70}
                      data={searchData}
                      loadMore={async () => {
                        if (loadlock.current) return;
                        await loadSearch(searchValue);
                      }}
                      count={searchData.length}
                      
                      render={({ index, data }) => (
                        <Votes
                          data={data[index]}
                          key={index}
                          onChange={() => {
                            setVoteData(data[index]);
                            setVoteStatus(true);
                          }}
                        />
                      )}
                    />
                  }
                />
              </Grid.Item>
            </Grid>
          </Container>
        </div>

        <Container className="pt-[54px] ">
          <InfiniteScroll
            height={bodyHeight > 0 ? bodyHeight - 55 * 2 : window.innerHeight}
            itemSize={70}
            data={tokens.data.bases}
            loadMore={getVoteData}
            count={tokens.total}
            className={`${searchStatus ? "opacity-0":"opacity-100"}`}
            render={({ index, data }) => (
              <Votes
                data={data[index]}
                key={index}
                onChange={() => {
                  setVoteData(data[index]);
                  setVoteStatus(true);
                }}
              />
            )}
          />
        </Container>
      </Box>
    </div>
  );
}
