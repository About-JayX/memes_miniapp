import { dataRequest } from '@/util/request'

export const tokensAPI = ({
  page,
  pageSize,
}: {
  page: number
  pageSize: number
}) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  })
  return dataRequest.get(`tokens/votes?${params}`)
}

export const searchTokensAPI = ({
  page,
  pageSize,
  search,
}: {
  page: number
  pageSize: number
  search: string
}) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    q: search,
  })
  return dataRequest.get(`ranking/search?${params}`)
}

export const updatePairsAPI = (data: any) => {
  return dataRequest.post(`tokens/pairs`, data)
}
