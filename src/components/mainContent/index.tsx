import NewUserRewards from '@/components/lib/newUserRewards'
import PublishTasks from '@/components/lib/publishTasks'
import Router from '@/router'
import TabBarComponent from '@/components/tabBar'
import { useBackButton } from '@/hooks/useBackButton'

interface MainContentProps {
  iconKey: string
  setIconKey: (key: string) => void
  publishTaskStatus: boolean
  setPublishTaskStatus: (status: boolean) => void
}

export default function MainContent({
  iconKey,
  setIconKey,
  publishTaskStatus,
  setPublishTaskStatus,
}: MainContentProps) {
  const { showTabBar } = useBackButton()

  return (
    <>
      <NewUserRewards />
      <PublishTasks
        open={publishTaskStatus}
        onClose={() => setPublishTaskStatus(false)}
      />

      <div className="h-screen flex flex-col" id="main">
        <div
          className={`flex-1 h-[calc(100vh-7rem)] ${showTabBar ? '' : 'pb-5'}`}
        >
          <Router />
        </div>
        {showTabBar && (
          <TabBarComponent
            iconKey={iconKey}
            setIconKey={setIconKey}
            setPublishTaskStatus={setPublishTaskStatus}
          />
        )}
      </div>
    </>
  )
}
