import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  readRecords: () => ipcRenderer.invoke('read-records'),
  addRecord: (record) => ipcRenderer.invoke('add-record', record),
  deleteRecord: (index) => ipcRenderer.invoke('delete-record', index),
  updateRecord: (index, record) => ipcRenderer.invoke('update-record', { index, record })
})
