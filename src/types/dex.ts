export interface Social {
  platform: string;
  handle: string;
  type?: string;
  url?: string;
}

export interface Website {
  url: string;
  label?: string;
}

export interface Info {
  imageUrl?: string;
  header?: string;
  openGraph?: string;
  socials: Social[];
  websites: Website[];
}

export interface PriceChange {
  m5?: number;
  h1?: number;
  h6?: number;
  h24?: number;
}

export interface Volume {
  m5?: number;
  h1?: number;
  h6?: number;
  h24?: number;
}

export interface BaseToken {
  address: string;
  name: string;
  symbol: string;
}

export interface Liquidity {
  usd?: number;
  base?: number;
  quote?: number;
}

export interface Transactions {
  m5?: {
    buys: number;
    sells: number;
  };
  h1?: {
    buys: number;
    sells: number;
  };
  h6?: {
    buys: number;
    sells: number;
  };
  h24?: {
    buys: number;
    sells: number;
  };
}

export interface Pair {
  timestamp?: number;
  chainId?: string;
  dexId: string;
  url?: string;
  pairAddress: string;
  baseToken?: BaseToken;
  quoteToken?: BaseToken;
  labels?: string[];
  priceNative?: string;
  priceUsd?: string;
  txns?: Transactions;
  volume?: Volume;
  priceChange?: PriceChange;
  liquidity?: Liquidity;
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  info?: Info;
}

export interface PairsResponse {
  address: string;
  pairs: Pair[] | null;
}
