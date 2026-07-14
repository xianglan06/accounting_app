// 数据存储工具 —— 封装 TXT 文件读写
// Electron 环境下通过 IPC 读写电脑上的 TXT 文件
// 浏览器开发环境下用 localStorage 模拟

const STORAGE_KEY = 'heima-records'

// 判断是否在 Electron 环境中
function isElectron() {
  return !!(window.electronAPI)
}

// 读取所有记录
export async function loadRecords() {
  if (isElectron()) {
    return await window.electronAPI.readRecords()
  } else {
    // 浏览器开发模式：用 localStorage 模拟
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }
}

// 添加一条记录
export async function addRecord(record) {
  if (isElectron()) {
    return await window.electronAPI.addRecord(record)
  } else {
    const records = await loadRecords()
    record.id = records.length + 1
    records.push(record)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    return records
  }
}

// 删除一条记录（按索引）
export async function deleteRecord(index) {
  if (isElectron()) {
    return await window.electronAPI.deleteRecord(index)
  } else {
    const records = await loadRecords()
    records.splice(index, 1)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    return records
  }
}

// 更新一条记录
export async function updateRecord(index, record) {
  if (isElectron()) {
    return await window.electronAPI.updateRecord(index, record)
  } else {
    const records = await loadRecords()
    records[index] = record
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    return records
  }
}
