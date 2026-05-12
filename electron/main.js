import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DATA_DIR = path.join(app.getPath('userData'), 'todo-data')
const DATA_FILE = path.join(DATA_DIR, 'todos.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readData() {
  ensureDataDir()
  if (!fs.existsSync(DATA_FILE)) {
    return { todos: [], tags: [] }
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { todos: [], tags: [] }
  }
}

function writeData(data) {
  ensureDataDir()
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    show: false,
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  win.once('ready-to-show', () => win.show())
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC handlers
ipcMain.handle('get-todos', () => {
  return readData()
})

ipcMain.handle('save-todos', (_, data) => {
  writeData(data)
  return true
})

ipcMain.handle('export-data', async (_, data) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: 'todos-backup.json',
    filters: [{ name: 'JSON', extensions: ['json'] }],
  })
  if (filePath) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  }
  return false
})

ipcMain.handle('import-data', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile'],
  })
  if (filePaths && filePaths.length > 0) {
    const content = fs.readFileSync(filePaths[0], 'utf-8')
    return JSON.parse(content)
  }
  return null
})
