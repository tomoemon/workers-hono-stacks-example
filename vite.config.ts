import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        outDir: './dist/public',
        emptyOutDir: true,
        rollupOptions: {
          input: './src/client/clientIndex.tsx',
          output: {
            entryFileNames: 'static/client.js',
            // TanStackRouter の分割されたファイルの配置場所
            chunkFileNames: 'static/[name]-[hash].js'
          }
        }
      }
    }
  } else {
    return {
      ssr: {
        external: ['react', 'react-dom']
      },
      plugins: [
        TanStackRouterVite({
          routesDirectory: 'src/client/routes',
          generatedRouteTree: 'src/client/routeTree.gen.ts'
        }),
        devServer({
          adapter,
          entry: 'src/server/serverIndex.tsx'
        })
      ],
      build: {
        ssr: true,
        outDir: 'dist',
        copyPublicDir: false,
        emptyOutDir: false,
        rollupOptions: {
          input: './src/server/serverIndex.tsx',
          output: {
            entryFileNames: 'index.js'
          }
        }
      }
    }
  }
})
