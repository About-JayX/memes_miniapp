import react from '@vitejs/plugin-react-swc'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import path from 'path'
import postcssPxtoRem from 'postcss-pxtorem'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteImagemin from 'vite-plugin-imagemin'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const env = process.argv[process.argv.indexOf('--mode') + 1].split('-')[1]

export default defineConfig({
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), './src/assets/icon')],
      symbolId: 'icon-[name]',
    }),
    react(),
    viteImagemin({
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
          title: `${
            env === 'memes' ? 'MEMES' : 'MEGO'
          } - A Web3-Powered Telegram Game.`,
          description: `${
            env === 'memes' ? 'MEMES' : 'MEGO'
          } - A Web3-Powered Telegram Game.`,
        },
        tags: [
          {
            injectTo: 'head',
            tag: 'link',
            attrs: {
              rel: 'stylesheet',
              href: `/${
                env === 'memes'
                  ? 'src/style/memes/global.scss'
                  : 'src/style/mego/global.scss'
              }`,
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
  esbuild: {
    target: 'esnext',
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
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
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: file => {
          // 只在非 .tgs 文件时生成 chunk 文件
          if (file.facadeModuleId && file.facadeModuleId.endsWith('.tgs')) {
            return 'assets/tgs/[name].js'
          }
          return 'assets/[name]-[hash].js'
        },
        assetFileNames: assetInfo => {
          // 确保 .tgs 文件不会被打包成 JS
          if (assetInfo.name?.endsWith('.tgs')) {
            return `assets/tgs/${assetInfo.name}`
          }
          return 'assets/[name]-[hash].[ext]'
        },
      },
      plugins: [],
    },
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
