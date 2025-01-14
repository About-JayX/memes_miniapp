import pako from 'pako'

// 类型定义
interface TgsFile {
  name: string
  type: 'tgs' | 'json'
}

interface TgsData {
  name: string
  data: string
}

// 基础文件配置
const baseFiles: TgsFile[] = [
  { name: '$', type: 'tgs' },
  { name: 'error', type: 'json' },
]

// 环境特定的额外文件
const extraFiles: Record<string, TgsFile[]> = {
  mego: [],
  memes: [
    { name: 'e', type: 'tgs' },
    { name: 's', type: 'tgs' },
  ],
  minidoge: [{ name: 'lang', type: 'tgs' }],
}

// 处理单个文件
async function processFile(filePath: string): Promise<TgsData | null> {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      console.error(
        `[TGS] Failed to fetch ${filePath}: ${response.status} ${response.statusText}`
      )
      return null
    }

    const data = await response.arrayBuffer()
    const uint8Array = new Uint8Array(data)
    let unzippedData: string

    // 从文件路径中提取文件名和类型
    const pathMatch = filePath.match(/\/([^/]+)\.(tgs|json)$/)
    if (!pathMatch) {
      console.error('[TGS] Invalid file path:', filePath)
      return null
    }

    const [, name, type] = pathMatch

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
      return { name, data: JSON.stringify(parsedData) }
    } catch (e) {
      console.error('[TGS] Failed to parse JSON data:', name, e)
      return null
    }
  } catch (e) {
    console.error('[TGS] Unexpected error loading file:', filePath, e)
    return null
  }
}

export default async (): Promise<TgsData[]> => {
  const env = import.meta.env.MODE.split('-')[1]
  const isDev = import.meta.env.MODE.includes('dev')

  console.log('[TGS] Loading TGS files for environment:', env)

  // 动态导入所有 tgs 和 json 文件
  const files = import.meta.glob('@/assets/tgs/**/*.{tgs,json}')
  const regex = /\/src\/assets\/tgs\/([^/]+)\/(.*)\.(tgs|json)$/

  // 合并基础文件和环境特定文件的路径
  const promiseParses = Object.entries(files).map(async ([key, _]) => {
    const match = key.match(regex)
    if (!match) return null

    const [, fileEnv, name, type] = match

    // 检查是否是当前环境的文件
    if (fileEnv && fileEnv !== env) return null

    // 构建文件路径
    const filePath = isDev ? key : `/assets/tgs/${name}.${type}`

    return processFile(filePath)
  })

  try {
    const parseTgs = (await Promise.all(promiseParses)).filter(
      (item): item is TgsData => item !== null
    )
    console.log(
      '[TGS] Successfully loaded files:',
      parseTgs.map(item => item.name)
    )
    return parseTgs
  } catch (e) {
    console.error('[TGS] Failed to load TGS files:', e)
    return []
  }
}
