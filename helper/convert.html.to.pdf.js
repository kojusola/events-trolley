const htmlPdf = require('html-pdf');
const ejs = require ('ejs');
const path = require("path");

const  htmlToPdfBuffer = async (pathname,params) =>{
  const html = await ejs.renderFile(path.join(__dirname, pathname), params);
  console.log(html);
  return new Promise((resolve, reject) => {
    htmlPdf.create(html,{ orientation: 'landscape', type: 'pdf', timeout: '100000' }).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

module.exports = htmlToPdfBuffer;