import { Toast as Toasts } from 'antd-mobile'

import TgsAnimation from '../tgsAnimation'
export default function Toast({
  type = 'success',
  content = '',
  tgs,
}: {
  tgs?: Array<{ name: string; data: any }>
  type?: 'success' | 'error'
  content?: string
}) {
  Toasts.clear()
  Toasts.show({
    maskClickable: false,
    icon: <TgsAnimation icon={type} propsTgs={tgs}></TgsAnimation>,
    content,
  })
  return null
}
