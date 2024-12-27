import { Container } from '@/components/box'
import InfiniteScroll from '@/components/infiniteScroll'
import { useAppDispatch, useAppSelector } from '@/store'
import { asyncGetTokenList } from '@/store/list'
import type { ItokenData } from '@/store/interface'
import VoteComponent from './vote'

interface ListContainerProps {
  bodyHeight: number
  searchStatus: boolean
  onVoteSelect: (data: ItokenData) => void
}

export default function ListContainer({
  bodyHeight,
  searchStatus,
  onVoteSelect,
}: ListContainerProps) {
  const dispatch = useAppDispatch()
  const { tokens } = useAppSelector(state => state.list)

  const getVoteData = async () => {
    await dispatch(asyncGetTokenList({}))
  }

  return (
    <Container className="pt-[54px]">
      <InfiniteScroll
        height={bodyHeight > 0 ? bodyHeight - 55 * 2 : window.innerHeight}
        itemSize={70}
        data={tokens.data.bases}
        loadMore={getVoteData}
        count={tokens.total}
        className={`${searchStatus ? 'opacity-0' : 'opacity-100'}`}
        render={({ index, data }) => (
          <VoteComponent
            data={data[index]}
            key={index}
            onChange={() => onVoteSelect(data[index])}
          />
        )}
      />
    </Container>
  )
}
