export const HIDE_TAB_BAR_PATHS: Array<string> = [
  '/list/details',
  '/invite',
  '/signin',
  '/integral',
  '/task/list',
  '/collect',
  '/search',
]

interface TabItem {
  click?: () => void
  key: string
  title?: string
  icon?: {
    active: string
    default: string
  }
  isPublish?: boolean
  hidden?: boolean
  className?: string
}

export const TAB_ITEMS: readonly TabItem[] = [
  {
    key: '/',
    title: 'public.home',
    icon: {
      active: 'tab/active/home',
      default: 'tab/home',
    },
  },
  {
    key: '/task',
    title: 'public.task',
    icon: {
      active: 'tab/active/task',
      default: 'tab/task',
    },
  },
  {
    key: '/publish1',
    hidden: true,
    icon: {
      active: 'tab/active/list',
      default: 'tab/list',
    },
  },
  {
    key: '/publish',
    isPublish: true,
    click: () => {
      console.log(import.meta.env.APP_NAME)
    },
    className:
      '!absolute left-0 top-[-20px] !w-full pointer-events-none transition duration-300 ease-in-out active:scale-90 active:opacity-80',
  },
  {
    key: '/list',
    title: 'public.tabRank',
    icon: {
      active: 'tab/active/list',
      default: 'tab/list',
    },
  },

  {
    key: '/profile',
    title: 'public.profile',
    icon: {
      active: 'tab/active/profile',
      default: 'tab/profile',
    },
  },
] as const

export const PUBLISH_BUTTON_STYLE = {
  memes: {
    iconBg: 'linear-gradient(15deg, #A440FD 15.65%, #0DC8EC 74.83%)',
    rounded: 'rounded-2xl',
    top: '0',
  },
  mego: {
    iconBg:
      'linear-gradient(56deg, rgb(0, 171, 94) 5.75%, rgb(35, 255, 156) 93.71%)',
    rounded: '!rounded-full',
    top: '0',
  },
  minidoge: {
    iconBg:
      'linear-gradient(56deg,var(--primary) 10%, #ffbf00 93.71%)',
    rounded: '!rounded-full',
    top: '-8px',
  },
} as any
