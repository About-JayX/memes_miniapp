import react from '@vitejs/plugin-react-swc'
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
import commonjs from '@rollup/plugin-commonjs'

const env = process.argv[process.argv.indexOf('--mode') + 1].split('-')[1]

export default defineConfig({
  plugins: [
    commonjs(),
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
        chunkFileNames: 'assets/[name]-[hash].js', // 加上哈希，防止缓存问题
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      plugins: [
        copy({
          targets: [
            // 根据环境变量动态处理 .tgs 文件的拷贝
            {
              src: `src/assets/tgs/${env}/**/*.tgs`, // 根据 env 确定复制的源文件夹
              dest: 'dist/assets/tgs',
            },
            {
              src: 'src/assets/**/*.json', // 拷贝所有的 .json 文件
              dest: 'dist/assets',
            },
          ],
          hook: 'writeBundle',
        }),
      ],
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
  assetsInclude: ['**/*.tgs'],
})
