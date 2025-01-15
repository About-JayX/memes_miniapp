import './index.scss'
import { Fragment } from 'react'

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
  const ENV_NAME = import.meta.env.MODE.split('-')[1]
  
  return (
    <a
      id="memes-button-icon"
      className={`relative text-current font-bold !bg-[var(--button-bg)] !shadow-[var(--button-shadow)] !border !border-[var(--button-border)] ${className}`}
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