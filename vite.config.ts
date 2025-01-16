import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import path from 'path'
import postcssPxtoRem from 'postcss-pxtorem'
import copy from 'rollup-plugin-copy'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteImagemin from 'vite-plugin-imagemin'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import fs from 'fs'
import react from '@vitejs/plugin-react-swc'

const env = process.argv[process.argv.indexOf('--mode') + 1].split('-')[1]

// 日志控制
const logger = {
  tgs: (message: string, type: 'info' | 'error' = 'info') => {
    if (process.env.DEBUG) {
      type === 'error'
        ? console.error(`[TGS] ${message}`)
        : console.log(`[TGS] ${message}`)
    }
  },
}

export default defineConfig({
  base: './',
  envDir: '_env',
  plugins: [
    {
      name: 'vite-plugin-mime-type',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript')
          }
          next()
        })
      },
    },
    {
      name: 'vite-plugin-tgs',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.includes('/src/assets/tgs/')) {
            const filePath = path.join(process.cwd(), req.url)
            try {
              if (fs.existsSync(filePath)) {
                logger.tgs(`Processing: ${path.basename(filePath)}`)
                const content = fs.readFileSync(filePath)
                const isJson = filePath.endsWith('.json')
                res.setHeader(
                  'Content-Type',
                  isJson ? 'application/json' : 'application/octet-stream'
                )
                res.end(content)
                return
              }
              logger.tgs(`File not found: ${path.basename(filePath)}`, 'error')
            } catch (error) {
              logger.tgs(
                `Error processing file: ${path.basename(filePath)}`,
                'error'
              )
            }
          }
          next()
        })
      },
    },
    {
      name: 'serve-tgs-files',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/assets/tgs/')) {
            // 重写路径到源文件目录
            const newPath = req.url.replace(
              '/assets/tgs/',
              `/src/assets/tgs/${env}/`
            )
            req.url = newPath
          }
          next()
        })
      },
    },
    {
      name: 'copy-tgs-files',
      closeBundle() {
        // 在构建完成后复制文件
        const srcDir = path.resolve(process.cwd(), 'src/assets/tgs', env)
        const destDir = path.resolve(process.cwd(), 'dist/assets/tgs')

        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true })
        }

        try {
          const files = fs.readdirSync(srcDir)
          files.forEach(file => {
            if (file.endsWith('.tgs') || file.endsWith('.json')) {
              fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file))
            }
          })
        } catch (error) {
          console.error('Error copying files:', error)
        }
      },
    },
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icon')], // 修复路径
      symbolId: 'icon-[name]',
    }),
    react(),
    viteImagemin({
      filter: file => {
        // 只处理当前项目的图片
        return (
          file.includes(`/image/${env}/`) ||
          file.includes('/image/openScreenAnimation/')
        )
      },
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
      pngquant: {
        quality: [0.7, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
    createHtmlPlugin({
      minify: true,
      entry: 'src/main.tsx',
      template: 'index.html',
      inject: {
        data: {
          title: `${env.toLocaleUpperCase()} - Earn Tokens/NFT Airdrops`,
          description: `${env.toLocaleUpperCase()} - Earn Tokens/NFT Airdrops`,
        },
        tags: [
          {
            injectTo: 'head',
            tag: 'link',
            attrs: {
              rel: 'stylesheet',
              href: `/${`src/style/${env}/global.scss`}`,
              as: 'style',
            },
          },
          {
            injectTo: 'body-prepend',
            tag: 'div',
            attrs: {
              id: 'root',
            },
          },
        ],
      },
    }),
  ],
  logLevel: 'warn', // 设置 Vite 日志级别
  clearScreen: false, // 防止清除控制台
  esbuild: {
    target: 'esnext',
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // 抑制依赖警告
        additionalData: `$env: "${env}";`,
      },
    },
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
        postcssPxtoRem({ rootValue: 16, propList: ['*'] }),
        cssnano({ preset: 'default' }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      crypto: 'crypto-js',
    },
  },
  optimizeDeps: {
    exclude: ['*.tgs', '*.json'],
    include: ['crypto-js'],
  },

  build: {
    rollupOptions: {
      external: [/\.tgs$/, /\.json$/, 'crypto'],
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: file => {
          // 只在非 .tgs 文件时生成 chunk 文件
          if (file.facadeModuleId && file.facadeModuleId.endsWith('.tgs')) {
            return 'assets/tgs/[name].js' // 确保.tgs文件正确输出
          }
          return 'assets/[name]-[hash].js'
        },
        assetFileNames: assetInfo => {
          // 确保 .tgs 文件不会被打包成 JS
          if (assetInfo.name?.endsWith('.tgs')) {
            return `assets/tgs/[name].[ext]` // 确保 .tgs 文件作为静态资源输出
          }
          return 'assets/[name]-[hash].[ext]'
        },
      },
      plugins: [
        copy({
          targets: [
            {
              src: `src/assets/tgs/${env}/*.tgs`,
              dest: 'dist/assets/tgs',
              rename: (name, extension) => `${name}.${extension}`,
            },
            {
              src: `src/assets/tgs/${env}/*.json`,
              dest: 'dist/assets/tgs',
              rename: (name, extension) => `${name}.${extension}`,
            },
            {
              src: [
                `public/image/${env}/**/*`,
                'public/image/openScreenAnimation/**/*',
              ],
              dest: 'dist/image',
            },
          ],
          hook: 'writeBundle',
        }),
      ],
    },
    assetsInlineLimit: 0, // 不要内联任何资源
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
        passes: 2,
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
    cssCodeSplit: true,
  },
  server: {
    host: true,
    hmr: true,
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'https://memes2.slerf.yachts',
        // rewrite: path => path.replace('/api', ''),
      },
    },
    watch: {
      usePolling: true,
    },
    fs: {
      strict: true,
    },
  },
  assetsInclude: ['**/*.tgs'], // 确保 Vite 处理 .tgs 文件作为静态资源
})
