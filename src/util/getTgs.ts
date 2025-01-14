/* eslint-disable no-async-promise-executor */
import pako from 'pako'

const tgsFiles = {
  mego: [
    { name: '$', type: 'tgs' },
    { name: 'error', type: 'json' }
  ],
  memes: [
    { name: '$', type: 'tgs' },
    { name: 'error', type: 'json' }
  ],
  minidoge: [
    { name: '$', type: 'tgs' },
    { name: 'error', type: 'json' }
  ]
}

export default async () => {
  const env = import.meta.env.MODE.split('-')[1]
  const files = tgsFiles[env as keyof typeof tgsFiles] || []
  const isDev = import.meta.env.MODE.includes('dev')
  
  const promiseParses = files.map(
    ({ name, type }) =>
      new Promise(async re => {
        try {
          const response = await fetch(
            isDev
              ? `/src/assets/tgs/${env}/${name}.${type}`
              : `/assets/tgs/${name}.${type}`
          )

          if (!response.ok) {
            console.error(`Failed to fetch ${name}.${type}: ${response.status} ${response.statusText}`)
            return re(null)
          }

          const data = await response.arrayBuffer()
          const uint8Array = new Uint8Array(data)
          let unzippedData
          
          if (type === 'json') {
            unzippedData = new TextDecoder('utf-8').decode(uint8Array)
          } else {
            const decompressed = pako.inflate(uint8Array)
            unzippedData = new TextDecoder('utf-8').decode(decompressed)
          }
          re({ name: name, data: unzippedData })
        } catch (e) {
          console.error('Failed to load TGS file:', name, type, e)
          re(null)
        }
      })
  )
  const parseTgs = (await Promise.all(promiseParses)).filter(item => item)

  return parseTgs
}
