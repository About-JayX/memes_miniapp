/* eslint-disable no-async-promise-executor */
import pako from 'pako'

export default async () => {
  const env = import.meta.env.MODE.split('-')[1]
  let files = import.meta.glob('@/assets/tgs/**/*.{tgs,json}')
  const regex = /\/src\/assets\/tgs\/([^/]+)\/(.*)\.(tgs|json)$/
  const promiseParses = Object.entries(files).map(
    ([key, _]) =>
      new Promise(async re => {
        const match = key.match(regex)
        const symbol = match ? match[1] : null
        const name = match ? match[2] : null
        const type = match ? match[3] : null

        if (symbol && symbol !== env) return re(null)

        const response = await fetch(
          import.meta.env.MODE.includes('dev')
            ? key
            : `/assets/tgs/${name}.${type}`
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
          console.log(e, 'error_')
          re(null)
        }
      })
  )
  const parseTgs = (await Promise.all(promiseParses)).filter(item => item)

  return parseTgs
}
