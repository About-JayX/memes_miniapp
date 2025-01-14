/* eslint-disable no-async-promise-executor */
import pako from 'pako'

interface TgsFile {
  name: string
  type: 'tgs' | 'json'
}

interface TgsData {
  name: string
  data: string
}

// 基础文件，所有环境都有
const baseFiles: TgsFile[] = [
  { name: '$', type: 'tgs' },
  { name: 'error', type: 'json' }
]

// 通用的动画文件
const commonAnimations: TgsFile[] = [
  { name: 'animate', type: 'tgs' },
  { name: 'telegram', type: 'tgs' },
  { name: 'money_fly', type: 'tgs' },
  { name: 'collect', type: 'tgs' },
  { name: 'm', type: 'tgs' },
  { name: 'integrals_5', type: 'tgs' },
  { name: 'integrals_4', type: 'tgs' },
  { name: 'tabsAdd', type: 'tgs' },
  { name: 'integral_3', type: 'tgs' },
  { name: 'newUserRewards', type: 'tgs' },
  { name: 'task', type: 'tgs' },
  { name: 'integral_2', type: 'tgs' },
  { name: 'integral_1', type: 'tgs' },
  { name: 'integral', type: 'tgs' },
  { name: 'top', type: 'tgs' },
  { name: 'friends', type: 'tgs' },
  { name: 'integrals', type: 'tgs' },
  { name: 'twitter', type: 'tgs' },
  { name: 'money', type: 'tgs' },
  { name: 'money_task', type: 'tgs' },
  { name: 'signIn', type: 'tgs' },
  { name: 'hot', type: 'tgs' },
  { name: 'top_1', type: 'tgs' }
]

// 环境特定的额外文件
const extraFiles: Record<string, TgsFile[]> = {
  mego: [],
  memes: [
    { name: 'e', type: 'tgs' },
    { name: 's', type: 'tgs' }
  ],
  minidoge: [
    { name: 'lang', type: 'tgs' }
  ]
}

// 组合所有文件列表
const tgsFiles: Record<string, TgsFile[]> = Object.entries(extraFiles).reduce(
  (acc, [env, extras]) => ({
    ...acc,
    [env]: [...baseFiles, ...commonAnimations, ...extras]
  }),
  {} as Record<string, TgsFile[]>
)

// 处理单个文件
async function processFile(name: string, type: string, filePath: string): Promise<TgsData | null> {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      console.error(`[TGS] Failed to fetch ${filePath}: ${response.status} ${response.statusText}`)
      return null
    }

    console.log('[TGS] Successfully fetched file:', filePath)
    const data = await response.arrayBuffer()
    const uint8Array = new Uint8Array(data)
    let unzippedData: string

    if (type === 'json') {
      unzippedData = new TextDecoder('utf-8').decode(uint8Array)
      console.log('[TGS] Decoded JSON file:', name)
    } else {
      try {
        const decompressed = pako.inflate(uint8Array)
        unzippedData = new TextDecoder('utf-8').decode(decompressed)
        console.log('[TGS] Decompressed TGS file:', name)
      } catch (e) {
        console.error('[TGS] Failed to decompress TGS file:', name, e)
        return null
      }
    }

    try {
      const parsedData = JSON.parse(unzippedData)
      console.log('[TGS] Successfully parsed JSON for:', name)
      return { name, data: JSON.stringify(parsedData) }
    } catch (e) {
      console.error('[TGS] Failed to parse JSON data:', name, e)
      return null
    }
  } catch (e) {
    console.error('[TGS] Unexpected error loading file:', name, type, e)
    return null
  }
}

export default async (): Promise<TgsData[]> => {
  const env = import.meta.env.MODE.split('-')[1]
  const files = tgsFiles[env] || []
  const isDev = import.meta.env.MODE.includes('dev')
  
  console.log('[TGS] Loading TGS files for environment:', env)
  console.log('[TGS] Is Development:', isDev)
  console.log('[TGS] Files to load:', files)

  const promiseParses = files.map(({ name, type }) => {
    const filePath = isDev
      ? `/src/assets/tgs/${env}/${name}.${type}`
      : `/assets/tgs/${name}.${type}`

    console.log('[TGS] Loading file from:', filePath)
    return processFile(name, type, filePath)
  })

  try {
    const parseTgs = (await Promise.all(promiseParses)).filter((item): item is TgsData => item !== null)
    console.log('[TGS] Successfully loaded files:', parseTgs.map(item => item.name))
    return parseTgs
  } catch (e) {
    console.error('[TGS] Failed to load TGS files:', e)
    return []
  }
}
