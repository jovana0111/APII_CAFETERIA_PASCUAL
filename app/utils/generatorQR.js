const qrcode = require('qrcode');
exports.generateQR = async (data) => {
return await qrcode.toDataURL(JSON.stringify(data));
};