import axios from 'axios'

const httpService = axios.create({
  baseURL: 'https://api.dexscreener.com',
})
export enum ChainId {
  Ethereum = 'ethereum',
  BSC = 'bsc',
  Polygon = 'polygon',
  Solana = 'solana',
  Base = 'base',
  Arbitrum = 'arbitrum',
  Blast = 'blast',
  Optimism = 'optimism',
}

export interface Pair {
  timestamp?: number
  chainId: ChainId
  dexId: string
  url: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  labels: string[]
  priceNative: string
  priceUsd?: string
  txns: {
    m5: {
      buys: number
      sells: number
    }
    h1: {
      buys: number
      sells: number
    }
    h6: {
      buys: number
      sells: number
    }
    h24: {
      buys: number
      sells: number
    }
  }
  volume: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  priceChange: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  liquidity?: {
    usd?: number
    base: number
    quote: number
  }
  fdv?: number
  pairCreatedAt?: number
  info?: Info
}

export interface PairsResponse {
  address: string
  pairs: Pair[] | null
}
export interface Info {
  imageUrl: string
  header: string
  openGraph: string
  websites: Website[]
  socials: Social[]
}
export interface Social {
  platform: string
  handle: string
}
export interface Website {
  url: string
}
export async function getPairByChainAndAddress(
  pairAddress: string[],
  chainId: ChainId = ChainId.Solana
): Promise<PairsResponse> {
  if (pairAddress.length > 30) {
    throw new Error('pairAddress length should be 30')
  }
  const response = await httpService.get(
    `/latest/dex/pairs/${chainId}/${pairAddress.join(',')}`
  )
  return response.data
}

export async function getPairByTokens(address: string): Promise<PairsResponse> {
  if (address === '8J6CexwfJ8CSzn2DgWhzQe1NHd2hK9DKX59FCNNMo2hu') {
    console.log('API Call - getPairByTokens for MINIDOGE:', { address })
  }
  const response = await httpService.get(`/latest/dex/tokens/${address}`)
  if (address === '8J6CexwfJ8CSzn2DgWhzQe1NHd2hK9DKX59FCNNMo2hu') {
    console.log('API Response - getPairByTokens for MINIDOGE:', response.data)
  }
  return { pairs: response.data.pairs, address }
}

export async function searchTokens(q: string): Promise<PairsResponse> {
  const response = await httpService.get('/latest/dex/search/', {
    params: { q },
  })
  return response.data
}
