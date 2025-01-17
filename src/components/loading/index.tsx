import { useTranslation } from 'react-i18next'
import { ProjectImage } from '@/util/imageLoader.ts'

const Loading = ({
  loading = false,
  type = 'fullscreen'
}: {
  loading?: boolean
  type?: 'fullscreen' | 'inline'
}) => {
  const { t } = useTranslation()

  if (!loading) return null

  const LoadingContent = () => (
    <div className="flex flex-col items-center">
      <div className="relative scale-120">
        <ProjectImage 
          path="pics/logo.png"
          className="w-14 h-14 object-contain"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="absolute w-[4.5rem] h-[4.5rem] border-2 border-transparent border-t-[--primary] rounded-full"
            style={{
              animation: "spin 1s linear infinite"
            }}
          />
          <div 
            className="absolute w-16 h-16 border-2 border-transparent border-t-[--primarys-color] rounded-full"
            style={{
              animation: "spin 1.2s linear infinite reverse"
            }}
          />
        </div>
      </div>
    </div>
  )

  if (type === 'inline') {
    return (
      <div className="flex items-center justify-center py-4">
        <LoadingContent />
      </div>
    )
  }

  return (
    <div className="fixed bg-black/80 !w-screen !h-screen z-[1000] opacity-80">
      <div className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]">
        <LoadingContent />
      </div>
    </div>
  )
}

export default Loading
