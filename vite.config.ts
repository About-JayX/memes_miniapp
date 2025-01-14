import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import path from "path";
import postcssPxtoRem from "postcss-pxtorem";
import copy from "rollup-plugin-copy";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import viteImagemin from "vite-plugin-imagemin";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

const env = process.argv[process.argv.indexOf('--mode') + 1].split('-')[1]
export default defineConfig({
  base: '/',
  assetsInclude: ['*.tgs', '*.json'],
  json: {
    stringify: true
  },
  plugins: [
    {
      name: 'vite-plugin-tgs',
      enforce: 'pre',
      transform(code, id) {
        if (!id.includes(`/tgs/${env}/`)) return null;
        if (id.endsWith('.tgs') || id.endsWith('.json')) {
          try {
            JSON.parse(code);
            return {
              code: `export default ${code}`,
              map: null
            };
          } catch (e) {
            return {
              code: 'export default {}',
              map: null
            };
          }
        }
      }
    },
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "./src/assets/icon")],
      symbolId: "icon-[name]",
    }),
    react(),
    viteImagemin({
      filter: (file) => {
        // 只处理当前项目的图片
        return file.includes(`/image/${env}/`) || file.includes('/image/openScreenAnimation/');
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
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),
    createHtmlPlugin({
      minify: true,
      entry: "src/main.tsx",
      template: "index.html",
      inject: {
        data:{
          title: `${env === "memes" ? "MEMES" : env === "minidoge" ? "MINIDOGE" : "MEGO"}`,
          description: `${env === "memes" ? "MEMES" : env === "minidoge" ? "MINIDOGE" : "MEGO"}`,
        },
        tags: [
          {
            injectTo: "head",
            tag: "link",
            attrs: {
              rel: "stylesheet",
              href: env === "memes" ? "./src/style/memes/global.scss" : env === "minidoge" ? "./src/style/minidoge/global.scss" : "./src/style/mego/global.scss",
              type: "text/css",
            },
          },
          {
            injectTo: "body-prepend",
            tag: "div",
            attrs: {
              id: "root",
            },
          },
        ],
      },
    }),
  ],
  esbuild: {
    target: "esnext",
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        additionalData: `$env: "${env}";`,
      },
    },
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
        postcssPxtoRem({ rootValue: 16, propList: ["*"] }),
        cssnano({ preset: "default" }),
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['*.tgs', '*.json'],
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
      plugins: [
        copy({
          targets: [
            {
              src: `src/assets/tgs/${env}/*.tgs`,
              dest: "dist/assets/tgs",
              rename: (name, extension) => `${name}.${extension}`
            },
            {
              src: `src/assets/tgs/${env}/*.json`,
              dest: "dist/assets/tgs",
              rename: (name, extension) => `${name}.${extension}`
            },
            {
              src: [
                `public/image/${env}/**/*`,
                'public/image/openScreenAnimation/**/*'
              ],
              dest: "dist/image"
            }
          ],
          hook: "writeBundle",
        }),
      ],
    },
    assetsInlineLimit: 0, // 不要内联任何资源
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log"],
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
      "/api": {
        changeOrigin: true,
        target: "https://memes2.slerf.yachts:8443",
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
});
