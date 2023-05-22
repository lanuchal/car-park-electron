import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import printer from "pdf-to-printer";
import PDFDocument from 'pdfkit';
import fs from 'fs';


function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  ipcMain.handle('ping', (evnet, data) => {
    console.log("data", data)
    // printData(data);
    createAndSavePDF()
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        console.error('Error creating PDF:', error);
      });

    return 'Pong!';
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
// function car-in 
const createAndSavePDF = () => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [80, 80] });

    doc.fontSize(6);
    doc.text(`This text is right aligned.`, {
      width: 0,
      align: 'right'
    }

    );

    // draw bounding rectangle

    const stream = doc.pipe(fs.createWriteStream('./src/pdf/carIn/file.pdf'));

    stream.on('finish', () => {
      resolve('PDF file created successfully');
    });

    stream.on('error', (error) => {
      reject(error);
    });

    doc.end();
  });
};



function printData(data) {
  const filePath = './src/pdf/' + data;
  printer.print(filePath)
    .then(() => {
      console.log('ไฟล์ PDF ถูกส่งไปยังเครื่องปริ้นแล้ว');
    })
    .catch((err) => {
      console.error('เกิดข้อผิดพลาดในการพิมพ์ไฟล์ PDF', err);
    });
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
