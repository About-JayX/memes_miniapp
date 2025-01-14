import { TabBar } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '@/components/icon'
import TgsAnimation from '@/components/tgsAnimation'
import { PUBLISH_BUTTON_STYLE, TAB_ITEMS } from '@/config/tabBar'
import { useAppSelector } from '@/store'
import { useTask } from '@/hooks/useTask'

const APP_NAME = import.meta.env.MODE.split('-')[1]

interface TabBarComponentProps {
  iconKey: string
  setIconKey: (key: string) => void
  setPublishTaskStatus: (status: boolean) => void
}

export default function TabBarComponent({
  iconKey,
  setIconKey,
  setPublishTaskStatus,
}: TabBarComponentProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { task } = useAppSelector(state => state.list)
  const { submitTask } = useTask()

  const handleTabChange = async (key: string) => {
    const whitelist = ['memes', 'mego']
    if (key === '/publish' || key === '/publish1') {
      if (whitelist.includes(APP_NAME)) {
        await submitTask()
        setTimeout(() => setPublishTaskStatus(true), 100)
        return
      } else {
        return
      }
    }

    navigate(key)
    setIconKey(key)
  }

  return (
    <div className="flex-[0] z-[999] h-[460px] relative bg-[--primary-body-color]">
      <TabBar
        className="z-[999] mb-7"
        safeArea
        onChange={handleTabChange}
        activeKey={iconKey || pathname}
        defaultActiveKey="/"
      >
        {TAB_ITEMS.map(item => (
          <TabBar.Item
            key={item.key}
            className={
              item.isPublish
                ? item.className
                : `transition duration-300 ease-in-out ${
                    pathname === item.key ? 'scale-100' : 'scale-90'
                  }`
            }
            title={item.title && t(item.title)}
            badge={item.key === '/task' ? task.total : undefined}
            icon={
              item.isPublish
                ? () => (
                    <div
                      className={`!h-[52px] !w-[52px] ${PUBLISH_BUTTON_STYLE[APP_NAME].rounded} flex justify-center items-center pointer-events-auto`}
                      style={{
                        background: PUBLISH_BUTTON_STYLE[APP_NAME].buttonBg,
                      }}
                    >
                      <TgsAnimation
                        className="h-12 w-12"
                        style={{ position: 'absolute', top: '0' }}
                        icon="tabsAdd"
                      />
                    </div>
                  )
                : (active: boolean) =>
                    item.hidden ? (
                      <div className="opacity-0">
                        <Icon
                          name={active ? item.icon!.active : item.icon!.default}
                        />
                      </div>
                    ) : (
                      <Icon
                        name={active ? item.icon!.active : item.icon!.default}
                      />
                    )
            }
          />
        ))}
      </TabBar>
    </div>
  )
}
