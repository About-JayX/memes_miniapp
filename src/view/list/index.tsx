import { Card, Ellipsis, Grid, Image } from 'antd-mobile'
import { Fragment, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import Box, { Container } from '@/components/box'
import MCard from '@/components/card'
import InfiniteScroll from '@/components/infiniteScroll'
import TgsAnimation from '@/components/tgsAnimation'
import { symbol } from '@/config'
import { useAppDispatch, useAppSelector } from '@/store'
import { asyncRankList } from '@/store/list'
import { getTextColorForBackground, semicolon } from '@/util'
import Loading from '@/components/loading'

export const PointsList = () => {
  const { t } = useTranslation()
  const { ranks } = useAppSelector(state => state.list)
  const dispatch = useAppDispatch()
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [bodyHeight, setBodyHeight] = useState(0)

  useEffect(() => {
    dispatch(asyncRankList({}))
  }, [])

  const getPointsData = async () => {
    if (ranks.data.data.length >= ranks.total) {
      return
    }
    setIsLoadingMore(true)
    try {
      await dispatch(asyncRankList({}))
    } finally {
      setIsLoadingMore(false)
    }
  }
  
  const navigate = useNavigate()

  return (
    <div className="h-[calc(100vh-3rem)]">
      <Box
        onBodyHeight={e => setBodyHeight(e)}
        body={
          <Grid
            columns={1}
            gap={24}
            className="justify-items-center text-center pb-4 mx-[-16px]"
          >
            {/* 前三名 */}
            <Grid.Item className="grid items-end gap-8 justify-center w-full grid-cols-[auto,1fr,auto] px-6">
              <Grid columns={1} gap={2} className="justify-items-center">
                {ranks.data.data?.[1] ? (
                  <Fragment>
                    <Grid.Item className="relative flex justify-center">
                      {ranks.data.data?.[1]?.avatar_url ? (
                        <Image
                          className="!w-[66px] !h-[66px] rounded-full text-base font-medium flex items-center justify-center"
                          src={ranks.data.data?.[1]?.avatar_url}
                        />
                      ) : (
                        <div
                          className="w-[66px] h-[66px] rounded-full text-base font-medium flex items-center justify-center"
                          style={{
                            background: getTextColorForBackground(
                              ranks.data.data?.[1]?.username?.toString()
                            ).backgroundColor,
                            color: getTextColorForBackground(
                              ranks.data.data?.[1]?.username?.toString()
                            ).textColor,
                          }}
                        >
                          {ranks.data.data?.[1]?.username
                            .slice(0, 2)
                            .toLocaleUpperCase()}
                        </div>
                      )}
                      <div className="absolute bottom-[-6px] rounded-full bg-[var(--list-rank-bg)] w-6 h-6 flex items-center justify-center text-[1.125rem] font-extrabold text-white">
                        2
                      </div>
                    </Grid.Item>
                    <Grid.Item className="text-base font-medium truncate mt-[10px] w-[66px] opacity-50">
                      @{ranks.data.data?.[1]?.username}
                    </Grid.Item>
                    <Grid.Item className="text-[var(--list-text-color)] text-sm font-normal flex">
                      <TgsAnimation
                        icon="integrals"
                        className="w-4 h-4 mt-[2px]"
                      />
                      &nbsp;<span className="text-[var(--list-score-color)] font-bold">{semicolon(ranks.data.data?.[1]?.score || 0)}&nbsp;${symbol}</span>
                    </Grid.Item>
                  </Fragment>
                ) : (
                  <Grid.Item>
                    <div className="!w-[66px] !h-[66px]" />
                  </Grid.Item>
                )}
              </Grid>
              <Grid columns={1} gap={2} className="justify-items-center">
                {ranks.data.data?.[0] ? (
                  <Fragment>
                    <Grid.Item className="relative flex justify-center">
                      <div className="absolute top-[-36px] left-0">
                        <TgsAnimation icon="top_1" className="!h-12" />
                      </div>
                      {ranks.data.data?.[0]?.avatar_url ? (
                        <Image
                          className="!w-[90px] !h-[90px] rounded-full text-base font-medium flex items-center justify-center z-10"
                          src={ranks.data.data?.[0]?.avatar_url}
                        />
                      ) : (
                        <div
                          className="w-[90px] h-[90px] rounded-full text-base font-medium flex items-center justify-center z-10"
                          style={{
                            background: getTextColorForBackground(
                              ranks.data.data?.[0]?.username.toString()
                            ).backgroundColor,
                            color: getTextColorForBackground(
                              ranks.data.data?.[0]?.username.toString()
                            ).textColor,
                          }}
                        >
                          {ranks.data.data?.[0]?.username
                            .slice(0, 2)
                            .toLocaleUpperCase()}
                        </div>
                      )}
                      <div className="z-10 absolute bottom-[-6px] rounded-full bg-[var(--list-rank-bg)] w-6 h-6 flex items-center justify-center text-[1.125rem] font-extrabold text-white">
                        1
                      </div>
                      <TgsAnimation
                        icon="animate"
                        className="absolute bottom-[12px] z-10 w-6 h-6 text-[--primary] mt-[-6px] ml-[4px] inline-block"
                      />
                    </Grid.Item>
                    <Grid.Item className="text-base font-medium truncate mt-[10px] w-[90px] opacity-75">
                      @{ranks.data.data?.[0]?.username}
                    </Grid.Item>
                    <Grid.Item className="text-[var(--list-text-color)] text-sm font-normal flex">
                      <TgsAnimation
                        icon="integrals"
                        className="w-4 h-4 mt-[2px]"
                      />
                      &nbsp;<span className="text-[var(--list-score-color)] font-bold">{semicolon(ranks.data.data?.[0]?.score || 0)}&nbsp;${symbol}</span>
                    </Grid.Item>
                  </Fragment>
                ) : (
                  <Grid.Item>
                    <Image className="!w-[90px] !h-[90px]" />
                  </Grid.Item>
                )}
              </Grid>
              <Grid columns={1} gap={2} className="justify-items-center">
                {ranks.data.data?.[2] ? (
                  <Fragment>
                    <Grid.Item className="relative flex justify-center">
                      {ranks.data.data?.[2]?.avatar_url ? (
                        <Image
                          className="!w-[66px] !h-[66px] rounded-full text-base font-medium flex items-center justify-center"
                          src={ranks.data.data?.[2]?.avatar_url}
                        />
                      ) : (
                        <div
                          className="w-[66px] h-[66px] rounded-full text-base font-medium flex items-center justify-center"
                          style={{
                            background: getTextColorForBackground(
                              ranks.data.data?.[2]?.username.toString()
                            ).backgroundColor,
                            color: getTextColorForBackground(
                              ranks.data.data?.[2]?.username.toString()
                            ).textColor,
                          }}
                        >
                          {ranks.data.data?.[2]?.username
                            ?.slice(0, 2)
                            .toLocaleUpperCase()}
                        </div>
                      )}
                      <div className="absolute bottom-[-6px] rounded-full bg-[var(--list-rank-bg)] w-6 h-6 flex items-center justify-center text-[1.125rem] font-extrabold text-white">
                        3
                      </div>
                    </Grid.Item>
                    <Grid.Item className="text-base font-medium truncate mt-[10px] w-[66px] opacity-75">
                      @{ranks.data.data?.[2]?.username}
                    </Grid.Item>
                    <Grid.Item className="text-[var(--list-text-color)] text-sm font-normal flex">
                      <TgsAnimation
                        icon="integrals"
                        className="w-4 h-4 mt-[2px]"
                      />
                      &nbsp;<span className="text-[var(--list-score-color)] font-bold">{semicolon(ranks.data.data?.[2]?.score || 0)}&nbsp;${symbol}</span>
                    </Grid.Item>
                  </Fragment>
                ) : (
                  <Grid.Item>
                    <div className="!w-[66px] !h-[66px]" />
                  </Grid.Item>
                )}
              </Grid>
            </Grid.Item>
          </Grid>
        }
      >
        <Container className="pt-0 pb-2">
          <Grid columns={1} gap={16}>
            <Grid.Item className="text-left text-base flex justify-between items-center gap-2">
              <span className="font-bold flex items-center">
                {t('public.rankingList')}&nbsp;<span className="font-bold">({ranks.total || 0})</span>&nbsp;
                <TgsAnimation icon="top" className="w-6 h-6" />
              </span>
            </Grid.Item>
            <Grid.Item className="grid gap-3">
              <div className="relative">
                <InfiniteScroll
                  loadMore={getPointsData}
                  height={bodyHeight > 0 ? bodyHeight - 160 : window.innerHeight}
                  itemSize={70}
                  data={ranks.data.data}
                  count={ranks.total || 0}
                  render={({ index, data }) => (
                    <MCard animation={false}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-[10px]">
                          {data[index].avatar_url ? (
                            <Image
                              className="!w-[40px] !h-[40px] rounded-full text-base font-medium flex items-center justify-center"
                              src={data[index].avatar_url}
                            />
                          ) : (
                            <div
                              className="w-[40px] h-[40px] rounded-full text-base font-medium flex items-center justify-center"
                              style={{
                                background: getTextColorForBackground(
                                  data[index].username?.toString()
                                ).backgroundColor,
                                color: getTextColorForBackground(
                                  data[index].username?.toString()
                                ).textColor,
                              }}
                            >
                              {data[index].username
                                ?.slice(0, 2)
                                .toLocaleUpperCase()}
                            </div>
                          )}
                          <Grid columns={1} gap={2} className="text-left">
                            <Grid.Item className="text-sm font-bold flex items-center break-all">
                              <Ellipsis
                                direction="end"
                                content={`@${data[index].username}`}
                                className="opacity-75"
                              />
                              &nbsp;
                              {index <= 1 && (
                                <TgsAnimation
                                  icon={`integrals_${index === 0 ? '4' : '5'}`}
                                  className="w-4 h-4 text-[--primary]  inline-block"
                                />
                              )}
                            </Grid.Item>
                            <Grid.Item className="flex items-center text-xs font-normal text-[var(--list-text-color)]">
                              <TgsAnimation
                                icon="integrals"
                                className="w-4 h-4 mt-[-3px]"
                              />
                              &nbsp;<span className="text-[var(--list-score-color)] font-bold">{semicolon(data[index].score)}&nbsp;${symbol}</span>
                            </Grid.Item>
                          </Grid>
                        </div>
                        <span className={`w-[30px] h-[30px] flex items-center justify-center text-[1.125rem] font-extrabold ${index < 10 ? 'text-[var(--list-rank-bg)]' : ''}`}>
                          {index <= 2 ? (
                            <div className="flex items-center">
                              <TgsAnimation
                                icon="top"
                                className="w-4 h-4 mt-[-3px]"
                              />
                              {index + 1}
                            </div>
                          ) : (
                            `#${index + 1}`
                          )}
                        </span>
                      </div>
                    </MCard>
                  )}
                />
              </div>
            </Grid.Item>
          </Grid>
        </Container>
      </Box>
      <div className="absolute bottom-8 h-[84px] w-full left-0 z-[999] flex items-center bg-[--primary-body-color] border-t border-[--primary-border-color] pb-4">
        <Card className="!bg-[--primary-body-color] w-full !rounded-none h-full flex items-center">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-[10px]">
              {ranks.userRank.avatar_url ? (
                <Image
                  className="!w-[40px] !h-[40px] rounded-full text-base font-medium flex items-center justify-center"
                  src={ranks.userRank.avatar_url}
                />
              ) : (
                <div
                  className="w-[40px] h-[40px] rounded-full text-base font-medium flex items-center justify-center"
                  style={{
                    background: getTextColorForBackground(
                      ranks.userRank.username.toString()
                    ).backgroundColor,
                    color: getTextColorForBackground(
                      ranks.userRank.username.toString()
                    ).textColor,
                  }}
                >
                  {ranks.userRank.username?.slice(0, 2).toLocaleUpperCase()}
                </div>
              )}
              <Grid columns={1} gap={2} className="text-left">
                <Grid.Item className="text-sm font-bold break-all flex items-center">
                  <Ellipsis
                    direction="end"
                    content={`@${ranks.userRank.username}`}
                    className="opacity-75"
                  />
                  &nbsp;
                  <TgsAnimation
                    icon="animate"
                    className="w-4 h-4 text-[--primary] inline-block"
                  />
                  &nbsp;
                  <a
                    className="text-[10px] text-nowrap font-bold bg-[--primary-card-body-color] py-[3px] px-2 rounded-full text-[#4FFFC4]"
                    onClick={() =>
                      navigate('/integral', {
                        state: { path: '/list' },
                      })
                    }
                  >
                    {t('public.details')}
                    {'>>'}
                  </a>
                </Grid.Item>
                <Grid.Item className="text-xs font-normal text-[var(--list-text-color)] flex items-center">
                  <TgsAnimation
                    icon="integrals"
                    className="w-4 h-4 mt-[-3px]"
                  />
                  &nbsp;<span className="text-[var(--list-score-color)] font-bold">{semicolon(ranks.userRank.score)}&nbsp;${symbol}</span>
                </Grid.Item>
              </Grid>
            </div>
            <span className="w-[30px] h-[30px] flex items-center justify-center text-[1.125rem] font-extrabold">{`#${ranks.userRank.rank}`}</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Container className="h-[calc(100vh-3rem)] overflow-hidden relative pb-10">
      <PointsList />
    </Container>
  )
}
