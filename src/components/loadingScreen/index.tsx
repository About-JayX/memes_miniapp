import Loading from '@/components/loading'
import OpenScreenAnimation from '@/components/openScreenAnimation/loading'
import { useAppSelector } from '@/store'

interface LoadingScreenProps {
  status: boolean
  onStatusChange: () => void
}

export default function LoadingScreen({
  status,
  onStatusChange,
}: LoadingScreenProps) {
  const { tgs } = useAppSelector(state => state.tgs)
  const { load } = useAppSelector(state => state.telegram)

  const renderContent = () => {
    if (!status) {
      return load.globalLoading ? (
        <div className="fixed inset-0 bg-[--primary-body-color] z-[9999]">
          <Loading loading={load.globalLoading} />
        </div>
      ) : null
    }

    return tgs.length ? (
      <div className="fixed inset-0 bg-[--primary-body-color] z-[9999]">
        <OpenScreenAnimation
          status={load.initLoading}
          onChange={onStatusChange}
        />
      </div>
    ) : null
  }

  return renderContent()
}
