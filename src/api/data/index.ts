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
  console.log('[search][API] searchTokensAPI called:', { page, pageSize, search })
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    q: search,
  })
  console.log('[search][API] request URL:', `ranking/search?${params}`)
  return dataRequest.get(`ranking/search?${params}`).then(response => {
    console.log('[search][API] response:', response)
    return response
  }).catch(error => {
    console.error('[search][API] error:', error)
    throw error
  })
}

export const updatePairsAPI = (data: any) => {
  return dataRequest.post(`tokens/pairs`, data)
}
