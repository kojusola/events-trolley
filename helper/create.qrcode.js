const QrCode = require('qrcode');

const generateQR = async text => {
    try {
      const data = await QrCode.toDataURL(text);
      // const qrImage = data.split(",")[1]
      return data
    } catch (err) {
      console.error(err)
    }
}