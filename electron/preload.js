const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => ipcRenderer.invoke('get-todos'),
  saveTodos: (data) => ipcRenderer.invoke('save-todos', data),
  exportData: (data) => ipcRenderer.invoke('export-data', data),
  importData: () => ipcRenderer.invoke('import-data'),
})
