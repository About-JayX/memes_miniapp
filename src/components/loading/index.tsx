import { SpinLoading } from 'antd-mobile'

const Loading = ({
  loading = false,
  text = 'loading',
}: {
  loading?: boolean
  text?: string
}) => {
  return loading ? (
    <div className="fixed bg-black/80 !w-screen !h-screen z-[1000] opacity-80">
      <div className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] !w-14 !h-14 flex flex-col justify-center items-center">
        <SpinLoading className="!w-12 !h-12" />
        <span className="mt-4 text-sm font-normal">{text}</span>
      </div>
    </div>
  ) : (
    ''
  )
}

export default Loading
