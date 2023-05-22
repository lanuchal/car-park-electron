import React from 'react'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew Bold.ttf',
    italics: 'THSarabunNew Italic.ttf',
    bolditalics: 'THSarabunNew BoldItalic.ttf'
  }
}

function App() {
  const prinerData = (data) => {
    console.log(data);

    const text = 'สวัสดี';

    window.electron.ipcRenderer.invoke('ping', text).then(re => {
      console.log(re)
    })
  }



  return (
    <div>หวัดดีasdas
      <button onClick={() => prinerData("หวัดดี")}>print</button>
    </div>
  )
}

export default App