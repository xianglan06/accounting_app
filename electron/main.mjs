import * as electron from 'electron/main'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const { app, BrowserWindow, ipcMain } = electron
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DATA_DIR = path.join(os.homedir(), '黑马记账')
const DATA_FILE = path.join(DATA_DIR, 'data.txt')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '', 'utf-8')
}

function readRecords() {
  ensureDataDir()
  const content = fs.readFileSync(DATA_FILE, 'utf-8')
  if (!content.trim()) return []
  const lines = content.trim().split('\n')
  const records = []
  for (const line of lines) {
    if (!line.trim()) continue
    const parts = line.split(' | ')
    if (parts.length >= 4) {
      const [date, type, categoryStr, amountStr, ...noteParts] = parts
      const [category1, category2] = categoryStr.split('-')
      records.push({
        id: records.length + 1,
        date: date.trim(),
        type: type.trim(),
        category1: (category1 || '').trim(),
        category2: (category2 || '').trim(),
        amount: parseFloat(amountStr.replace('¥', '')),
        note: noteParts.join(' | ').trim()
      })
    }
  }
  return records
}

function writeRecords(records) {
  ensureDataDir()
  const lines = records.map(r =>
    `${r.date} | ${r.type} | ${r.category1}-${r.category2} | ¥${r.amount.toFixed(2)} | ${r.note || ''}`
  )
  fs.writeFileSync(DATA_FILE, lines.join('\n') + '\n', 'utf-8')
}

function addRecord(record) {
  ensureDataDir()
  const line = `${record.date} | ${record.type} | ${record.category1}-${record.category2} | ¥${record.amount.toFixed(2)} | ${record.note || ''}`
  fs.appendFileSync(DATA_FILE, line + '\n', 'utf-8')
}

function setupIPC() {
  ipcMain.handle('read-records', () => readRecords())
  ipcMain.handle('add-record', (event, record) => { addRecord(record); return readRecords() })
  ipcMain.handle('delete-record', (event, recordIndex) => {
    const records = readRecords(); records.splice(recordIndex, 1); writeRecords(records); return records
  })
  ipcMain.handle('update-record', (event, { index, record }) => {
    const records = readRecords(); records[index] = record; writeRecords(records); return records
  })
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100, height: 750, title: '黑马记账',
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  setupIPC(); createWindow()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
