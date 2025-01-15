import { useEffect, useState } from 'react'
import api from '@/api'
import Box, { Container } from '@/components/box'
import UserHeader from '@/components/lib/userHeader'
import Vote from '@/components/lib/vote'
import { useAppDispatch, useAppSelector } from '@/store'
import { updateToken } from '@/store/list'
import { basePair } from '@/util/baseData'
// import SearchContainer from './components/search'
import ListContainer from './components/list'
import UserInfo from './components/userInfo'
import type { ItokenData } from '@/store/interface'

export default function Home() {
  const [voteStatus, setVoteStatus] = useState(false)
  const [voteData, setVoteData] = useState<ItokenData | null>(basePair)
  // const [searchStatus, setSearchStatus] = useState(false)
  const [searchLoadStatus, setSearchLoadStatus] = useState(false)
  const [viewStatus, setViewStatus] = useState(false)
  const [bodyHeight, setBodyHeight] = useState(0)

  const dispatch = useAppDispatch()
  const { tokens } = useAppSelector(state => state.list)

  // 清理函数
  useEffect(() => {
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
      )
    }
  }, [dispatch, tokens.pageSize, tokens.data.votes])

  const handleVoteSelect = (data: ItokenData) => {
    setVoteData(data)
    setVoteStatus(true)
  }

  const handleVoteSubmit = async () => {
    const result = await api.vote.userPointRank({
      address: voteData?.pair?.baseToken.address || '',
    })
    if (!result.success) {
      return Promise.reject(result.message)
    }
  }

  return (
    <div className="home h-full">
      <Vote
        voteData={voteData}
        open={voteStatus}
        onClose={() => setVoteStatus(false)}
        onChange={handleVoteSubmit}
      />

      <Box
        viewStatus={viewStatus}
        onViewStatus={setViewStatus}
        onBodyHeight={setBodyHeight}
        header={
          <Container className="py-0">
            <UserHeader
              viewStatus={viewStatus}
              bodyHeight={bodyHeight}
              // onSearchStatus={setSearchStatus}
              onSearchLoadStatus={setSearchLoadStatus}
              onVoteSelect={handleVoteSelect}
            />
          </Container>
        }
        body={<UserInfo searchLoadStatus={searchLoadStatus} />}
      >
        {/* <SearchContainer
          viewStatus={viewStatus}
          bodyHeight={bodyHeight}
          onSearchStatus={setSearchStatus}
          onSearchLoadStatus={setSearchLoadStatus}
          onVoteSelect={handleVoteSelect}
        /> */}

        <ListContainer
          bodyHeight={bodyHeight}
          // searchStatus={searchStatus}
          onVoteSelect={handleVoteSelect}
        />
      </Box>
    </div>
  )
}
