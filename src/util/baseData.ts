import { ChainId } from '@/api/dex'

export const basePair = {
  id: 0,
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  chainId: 0,
  logo: '',
  votes: 0,
  updatedAt: '',

  pair: {
    chainId: ChainId.Ethereum,
    dexId: '',
    url: '',
    pairAddress: '',
    baseToken: {
      address: '',
      name: '',
      symbol: '',
    },
    quoteToken: {
      address: '',
      name: '',
      symbol: '',
    },
    labels: [],
    priceNative: '',
    txns: {
      m5: {
        buys: 0,
        sells: 0,
      },
      h1: {
        buys: 0,
        sells: 0,
      },
      h6: {
        buys: 0,
        sells: 0,
      },
      h24: {
        buys: 0,
        sells: 0,
      },
    },
    volume: {
      m5: 0,
      h1: 0,
      h6: 0,
      h24: 0,
    },
    priceChange: {
      m5: 0,
      h1: 0,
      h6: 0,
      h24: 0,
    },
  },
}
