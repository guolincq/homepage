import { preview } from 'vite'

const port = Number(process.env.PORT) || 4173

const server = await preview({
  configFile: './vite.config.js',
  preview: { port, host: '0.0.0.0', allowedHosts: true, strictPort: true },
})

server.printUrls()
