import { Grid } from 'antd-mobile'
import { useCallback, useState, useRef } from 'react'
import { searchTokensAPI, updatePairsAPI } from '@/api/data'
import { getPairByTokens, type PairsResponse, type Pair } from '@/api/dex'
import { Container } from '@/components/box'
import InfiniteScroll from '@/components/infiniteScroll'
import Search from '@/components/search'
import { useAppDispatch } from '@/store'
import { updateSearchs } from '@/store/list'
import { isTimeExceededByOneMinute } from '@/util'
import { basePair } from '@/util/baseData'
import type { ItokenData } from '@/store/interface'
import VoteComponent from './vote'

interface SearchContainerProps {
  viewStatus: boolean
  bodyHeight: number
  onSearchStatus: (status: boolean) => void
  onSearchLoadStatus: (status: boolean) => void
  onVoteSelect: (data: ItokenData) => void
}

export default function SearchContainer({
  viewStatus,
  bodyHeight,
  onSearchStatus,
  onSearchLoadStatus,
  onVoteSelect,
}: SearchContainerProps) {
  const [page, setPage] = useState(1)
  const pageSize = useRef(20)
  const [searchData, setSearchData] = useState<ItokenData[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const loadlock = useRef(true)
  const dispatch = useAppDispatch()

  const loadSearch = useCallback(async (search?: string, pageParams?: number) => {
    if (!search) return
    setSearchValue(search)
    const result = await searchTokensAPI({
      page: pageParams ? pageParams : page,
      pageSize: pageSize.current,
      search,
    })

    if (result.length < pageSize.current) {
      setHasMore(false)
    }
    pageParams ? setPage(pageParams + 1) : setPage(page + 1)
    
    let parsePairs = result.map((item: any) => ({
      ...item,
      pair: item.pair ? JSON.parse(item.pair as string) : item.pair,
    }))

    // 构建需要请求pair的列表
    const requestPairs: Array<Promise<PairsResponse>> = parsePairs
      .filter((item: any) => (
        !item.pair || isTimeExceededByOneMinute(item.pair.timestamp || 0)
      ))
      .map((item: any) => getPairByTokens(item.address))

    const pairs = (await Promise.all(requestPairs)).reduce(
      (acc: { [key: string]: Pair | undefined }, pairs: PairsResponse) => {
        const tokenAddress = pairs.address
        const maxPair = pairs?.pairs?.reduce((result: Pair, pair: Pair) => {
          if (pair?.baseToken.address === tokenAddress) {
            return (result.fdv || 0) > (pair.fdv || 0) ? result : pair
          }
          return result
        }, basePair.pair)
        maxPair && (acc[tokenAddress] = maxPair)
        return acc
      },
      {}
    )

    const updatePairs = Object.values(pairs)
    if (updatePairs.length) {
      const timestamp = new Date().getTime()
      // 更新列表数据
      parsePairs = parsePairs.map((item: any) => {
        const pair = updatePairs.find(
          p => p?.baseToken.address === item.address
        )
        return pair ? { ...item, pair } : item
      })
      updatePairsAPI(updatePairs.map(item => ({ ...item, timestamp })))
    }

    const searchs = parsePairs.filter((item: any) => item.pair)
    const newSearchData = pageParams ? searchs : [...searchData, ...searchs]
    
    setSearchData(newSearchData)
    dispatch(updateSearchs(newSearchData))
  }, [dispatch, page, searchData])

  return (
    <div className="search-bar absolute z-10 w-full">
      <Container className="pt-0 pb-2">
        <Grid columns={1} gap={20}>
          <Grid.Item>
            <Search
              viewStatus={viewStatus}
              placeholder="Search"
              onBodyHeight={() => {}}
              onStatus={onSearchStatus}
              onSearchLoadStatus={onSearchLoadStatus}
              onChange={async (search: string) => {
                loadlock.current = true
                setHasMore(true)
                if (!search) return
                await loadSearch(search, 1)
                loadlock.current = false
              }}
              content={
                <InfiniteScroll
                  height={bodyHeight > 0 ? bodyHeight - 55 * 2 : window.innerHeight}
                  itemSize={70}
                  data={searchData}
                  loadMore={async () => {
                    if (loadlock.current) return
                    await loadSearch(searchValue)
                  }}
                  count={searchData.length}
                  render={({ index, data }) => (
                    <VoteComponent
                      data={data[index]}
                      key={index}
                      onChange={() => onVoteSelect(data[index])}
                    />
                  )}
                />
              }
            />
          </Grid.Item>
        </Grid>
      </Container>
    </div>
  )
} 