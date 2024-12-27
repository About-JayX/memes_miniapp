import { lazy, Suspense, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'

import lang from '@/config/locale'
import RouterConfig from '@/config/router'
import { ImportMetaGlobType, RouterDataType } from '@/router/type'

const param: Record<string, string[]> = RouterConfig.param

// 只导入直接位于 view 目录下的 tsx 文件和子目录下的 index.tsx，排除 components 文件夹
const view = import.meta.glob<ImportMetaGlobType>([
  '@/view/*.tsx',
  '@/view/*/index.tsx',
  '!@/view/**/components/**/*.tsx'
])

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

    // 处理路由路径
    let routePath = ''
    if (dirPath === 'index' && componentName === 'index') {
      // view/index/index.tsx 映射到根路径 "/"
      routePath = '/'
    } else if (componentName === 'index') {
      // 其他 index.tsx 映射到目录路径
      routePath = `/${dirPath}`
    } else {
      // 非 index 文件映射到完整路径
      routePath = `/${dirPath}/${componentName.toLowerCase()}`
    }

    // 移除多余的斜杠
    routePath = routePath.replace(/\/+/g, '/')
    if (routePath !== '/' && routePath.endsWith('/')) {
      routePath = routePath.slice(0, -1)
    }

    const Component = lazy(() =>
      page().then(module => ({ default: module.default }))
    )

    return {
      path: routePath,
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

        // 不要为根路径添加语言前缀的重复路由
        if (route.path === '/') {
          return [
            { ...route },
            { ...route, path: `/${params}`.replace(/\/+/g, '/') },
          ]
        }

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
