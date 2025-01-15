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
  const [isSearching, setIsSearching] = useState(false)
  const loadlock = useRef(true)
  const currentSearchCount = useRef(0)
  const lastSearchTime = useRef(0)
  const lastSearchReset = useRef(0)
  const lastSearchValue = useRef('')
  const dispatch = useAppDispatch()

  const resetSearchCount = useCallback(() => {
    const now = Date.now()
    if (now - lastSearchReset.current > 5 * 60 * 1000) {
      currentSearchCount.current = 0
      lastSearchReset.current = now
      console.log('[search][SearchContainer] Reset search count')
    }
  }, [])

  const loadSearch = useCallback(async (search?: string, pageParams?: number) => {
    console.log('[search][SearchContainer] loadSearch called:', { search, pageParams })
    if (!search) return

    const now = Date.now()
    if (now - lastSearchTime.current < 2000) {
      console.log('[search][SearchContainer] Search too frequent')
      return
    }
    lastSearchTime.current = now

    if (search !== lastSearchValue.current) {
      resetSearchCount()
      if (currentSearchCount.current >= 10) {
        console.log('[search][SearchContainer] Search count exceeded for current session')
        return
      }
      currentSearchCount.current++
      lastSearchValue.current = search
    }

    try {
      setIsSearching(true)
      setSearchValue(search)
      console.log('[search][SearchContainer] calling API')
      const result = await searchTokensAPI({
        page: pageParams ? pageParams : page,
        pageSize: pageSize.current,
        search,
      })
      console.log('[search][SearchContainer] API raw result:', result)

      if (!Array.isArray(result)) {
        console.error('[search][SearchContainer] API result is not an array:', result)
        return
      }

      pageParams ? setPage(pageParams + 1) : setPage(page + 1)

      let parsePairs = result.map((item: any) => {
        console.log('[search][SearchContainer] Processing item:', item)
        return {
          ...item,
          pair: item.pair ? (
            typeof item.pair === 'string' ? JSON.parse(item.pair) : item.pair
          ) : null
        }
      })

      console.log('[search][SearchContainer] parsePairs:', parsePairs)

      const requestPairs: Array<Promise<PairsResponse>> = parsePairs
        .filter((item: any) => (
          item.address && (!item.pair || isTimeExceededByOneMinute(item.pair?.timestamp || 0))
        ))
        .map((item: any) => getPairByTokens(item.address))

      console.log('[search][SearchContainer] requesting pairs:', requestPairs.length)

      if (requestPairs.length > 0) {
        const pairs = (await Promise.all(requestPairs)).reduce(
          (acc: { [key: string]: Pair | undefined }, pairs: PairsResponse) => {
            if (!pairs || !pairs.address) {
              console.log('[search][SearchContainer] Invalid pairs response:', pairs)
              return acc
            }
            const tokenAddress = pairs.address
            const maxPair = pairs?.pairs?.reduce((result: Pair, pair: Pair) => {
              if (pair?.baseToken.address === tokenAddress) {
                return (result.fdv || 0) > (pair.fdv || 0) ? result : pair
              }
              return result
            }, basePair.pair)
            if (maxPair) {
              acc[tokenAddress] = maxPair
            }
            return acc
          },
          {}
        )

        console.log('[search][SearchContainer] pairs:', pairs)

        const updatePairs = Object.values(pairs)
        if (updatePairs.length) {
          const timestamp = new Date().getTime()
          parsePairs = parsePairs.map((item: any) => {
            const pair = pairs[item.address]
            return pair ? { ...item, pair } : item
          })
          console.log('[search][SearchContainer] updating pairs API')
          await updatePairsAPI(updatePairs.map(item => ({ ...item, timestamp })))
        }
      }

      const searchs = parsePairs.filter(item => item.pair)
      const newSearchData = pageParams === 1 ? searchs : [...searchData, ...searchs]

      console.log('[search][SearchContainer] final search data:', newSearchData)
      setSearchData(newSearchData)
      dispatch(updateSearchs(newSearchData))
    } catch (error) {
      console.error('[search][SearchContainer] Error in loadSearch:', error)
    } finally {
      setIsSearching(false)
      loadlock.current = true
    }
  }, [dispatch, page, searchData])

  return (
    <div className="search-bar fixed z-50 w-full">
      <Container className="pt-0 pb-2">
        <Grid columns={1} gap={20}>
          <Grid.Item>
            <Search
              viewStatus={viewStatus}
              placeholder="public.search"
              onBodyHeight={() => {}}
              onStatus={onSearchStatus}
              onSearchLoadStatus={onSearchLoadStatus}
              value={searchValue}
              onChange={async (search: string) => {
                console.log('[search][SearchContainer] Search onChange:', search)
                setSearchValue(search)
                setPage(1)
                setSearchData([]) 
                if (!search) {
                  loadlock.current = false
                  return
                }
                try {
                  await loadSearch(search, 1)
                } finally {
                  loadlock.current = false
                  onSearchLoadStatus(false)
                }
              }}
              content={searchData.length > 0 ? (
                <InfiniteScroll
                  height={window.innerHeight - 310}
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
              ) : null}
            />
          </Grid.Item>
        </Grid>
      </Container>
    </div>
  )
}