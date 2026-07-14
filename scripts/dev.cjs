// 开发启动脚本
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const { createServer } = require('vite')

// Electron 资源目录
const RESOURCES_DIR = path.join(process.cwd(), 'node_modules', 'electron', 'dist', 'resources')
const APP_DIR = path.join(RESOURCES_DIR, 'app')

async function start() {
  // 1. 将 Electron 主进程文件复制到 resources/app/ 目录
  //    因为 Electron 的 electron/main 模块只在 resources 目录内可用
  fs.mkdirSync(APP_DIR, { recursive: true })
  fs.copyFileSync(
    path.join(process.cwd(), 'electron', 'main.mjs'),
    path.join(APP_DIR, 'main.mjs')
  )
  fs.copyFileSync(
    path.join(process.cwd(), 'electron', 'preload.mjs'),
    path.join(APP_DIR, 'preload.mjs')
  )
  fs.writeFileSync(path.join(APP_DIR, 'package.json'), JSON.stringify({
    name: 'heima-jizhang',
    version: '1.0.0',
    main: 'main.mjs',
    type: 'module'
  }))

  console.log('已同步 Electron 主进程文件')

  // 2. 启动 Vite 开发服务器
  const vite = await createServer({
    server: { port: 5173 }
  })
  await vite.listen()

  const address = vite.config.server.host || 'localhost'
  const port = vite.config.server.port || 5173
  const url = `http://${address}:${port}`

  console.log(`Vite 开发服务器: ${url}`)

  // 3. 启动 Electron（无参数启动，自动加载 resources/app/）
  const electronExe = path.join(process.cwd(), 'node_modules', 'electron', 'dist', 'electron.exe')
  const electron = spawn(electronExe, [], {
    env: { ...process.env, VITE_DEV_SERVER_URL: url },
    stdio: 'inherit'
  })

  electron.on('close', () => {
    vite.close()
    process.exit()
  })
}

start().catch(err => {
  console.error('启动失败:', err.message)
  process.exit(1)
})
