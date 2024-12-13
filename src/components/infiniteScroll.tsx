import { InfiniteScroll as InfiniteScrolls } from 'antd-mobile'
import { Fragment, useEffect, useState } from 'react'

export default function InfiniteScroll({
  children,
  loadMore = async () => Promise<any>,
  topElement,
  count = 0,
  data = [],
  render,
  className = '',
  ...props
}: {
  topElement?: React.ReactNode
  children?: React.ReactNode
  loadMore?: () => Promise<any>
  count?: number
  data?: any[]
  render?: (props: { index: number; data: any[] }) => React.ReactNode
  className?: string
} & { height?: number; itemSize?: number }) {
  // 更多加载状态:true 加载中 false 没有更多
  const [hasMore, setHasMore] = useState(true)
  // 加载状态
  const [loading, setLoading] = useState(false)
  const [lastLoadTime, setLastLoadTime] = useState(0)

  const [dataStatus, setDataStatus] = useState(false)

  useEffect(() => {
    setHasMore(data.length <= count)
  }, [data.length, count])

  const handleLoadMore = async () => {
    setDataStatus(true)
    if (!dataStatus) return
    const now = Date.now()
    if (loading || !hasMore || now - lastLoadTime < 1000) return

    setLoading(true)
    setLastLoadTime(now)

    try {
      loadMore && (await loadMore?.())
    } catch (error) {
      console.log(error, 'error_')

      throw new Error('mock request failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleLoadMore()
  }, [dataStatus])
  return (
    <>
      {data.length <= 0 ? (
        <>
          {topElement}
          <div className={`${className}`}>
            <InfiniteScrolls hasMore={hasMore} loadMore={handleLoadMore} />
          </div>
        </>
      ) : (
        <div
          className="overflow-hidden overflow-y-auto"
          style={{ height: props.height }}
        >
          {topElement}
          <div className={`${className} flex flex-col gap-2`}>
            {data.map((_, index) => (
              <Fragment key={index}>
                <div>
                  {render && render({ index, data })}
                  {index + 1 >= data.length && (
                    <Fragment>
                      <InfiniteScrolls
                        loadMore={handleLoadMore}
                        hasMore={hasMore}
                      />
                      <div className="h-[53px]" />
                    </Fragment>
                  )}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
