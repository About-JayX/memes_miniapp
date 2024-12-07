/* eslint-disable no-async-promise-executor */
import pako from 'pako'

export default async () => {
  const files = import.meta.glob('@/assets/tgs/**/*.{tgs,json}')
  const regex = /\/src\/assets\/tgs\/(.*)\.(tgs|json)$/
  const promiseParses = Object.entries(files).map(
    ([key, _]) =>
      new Promise(async re => {
        const match = key.match(regex)
        const name = match ? match[1] : null // 提取文件名
        const type = match ? match[2] : null

        const response = await fetch(
          import.meta.env.MODE === 'development'
            ? key
            : `/assets/${name}.${type}`
        ) // 确保路径正确

        const data = await response.arrayBuffer()
        const uint8Array = new Uint8Array(data)
        let unzippedData
        try {
          if (type === 'json') {
            unzippedData = new TextDecoder('utf-8').decode(uint8Array)
          } else {
            const decompressed = pako.inflate(uint8Array)
            unzippedData = new TextDecoder('utf-8').decode(decompressed)
          }
          re({ name: name, data: unzippedData })
        } catch (e) {
          re(null)
        }
      })
  )
  const parseTgs = await Promise.all(promiseParses)
  return parseTgs
}
