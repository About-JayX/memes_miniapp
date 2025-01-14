import './index.scss'

import { Fragment } from 'react'
const ENV_NAME = import.meta.env.MODE.split('-')[1] 
export default function Button({
  animation = true,
  className = '',
  ...props
}: {
  children?: React.ReactNode
  onClick?: () => void
  className?: string
  animation?: boolean
}) {
  const styles:any = {
    memes: {
      button: '!bg-white/10 !shadow-sm',
    },
    minidoge: {
      button: '!bg-white/10 !shadow-sm !border !border-white/10',
    },
    mego: {
      button: '!bg-white/10 !shadow-sm',
    },  
  }
  
  return (
    <a
      id="memes-button-icon"
      className={`relative text-current font-bold ${
        styles[ENV_NAME].button
      } ${className} `}
      {...props}
    >
      {ENV_NAME === "memes" ? (
        <Fragment>
          {animation && <div className="filterBorder" />}
          {animation && <div className="filterBg" />}
        </Fragment>
      ) : (
        ''
      )}

      {props.children}
    </a>
  )
}