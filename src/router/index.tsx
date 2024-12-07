import { lazy, Suspense, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'

import lang from '@/config/locale'
import RouterConfig from '@/config/router'
import { ImportMetaGlobType, RouterDataType } from '@/router/type'

const param: Record<string, string[]> = RouterConfig.param

const view = import.meta.glob<ImportMetaGlobType>('@/view/**/*.tsx')

const generateRoutes = (
  pages: [string, () => Promise<{ default: React.ComponentType }>][]
): RouterDataType[] => {
  return pages.map(([path, page]) => {
    const segments = path.split('/')
    const componentName = segments.pop()?.replace(/.tsx$/, '') ?? ''
    const dirPath = segments
      .slice(segments.indexOf('view') + 1)
      .map(seg => seg.toLowerCase())
      .join('/')
    const routePath =
      componentName === 'index'
        ? `/${dirPath}`
        : `/${dirPath}/${componentName.toLowerCase()}`

    const Component = lazy(() =>
      page().then(module => ({ default: module.default }))
    )

    return {
      path: routePath === '' ? '/' : routePath,
      element: <Component />,
    }
  })
}

export default function Router() {
  const { i18n } = useTranslation()

  const routes = useMemo(() => generateRoutes(Object.entries(view)), [])

  const langRoutes = useMemo(() => {
    const supportedLangs = Object.keys(lang)

    return supportedLangs.flatMap(langKey => {
      return routes.flatMap(route => {
        const params =
          param[route.path]?.length > 0
            ? `/:${param[route.path].join('/:')}`
            : ''

        return [
          { ...route, path: `/${langKey}${route.path}` },
          { ...route, path: `${route.path}${params}` },
          { ...route, path: `/${langKey}${route.path}${params}` },
        ]
      })
    })
  }, [routes])

  const allRoutes = useMemo(
    () => [...routes, ...langRoutes],
    [routes, langRoutes]
  )

  useEffect(() => {
    const supportedLangs = Object.keys(lang)
    if (!supportedLangs.includes(i18n.language)) {
      i18n.changeLanguage(supportedLangs[0])
    }
  }, [i18n.language])

  return (
    <Suspense>
      <Routes>
        {allRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<>404 Not Found</>} />
      </Routes>
    </Suspense>
  )
}
