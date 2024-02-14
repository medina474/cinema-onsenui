'use strict';

function afficheticket() {
  const html5QrCode = new Html5Qrcode(
    "reader", {
    formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13]
  });

  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    new QRCode(page.querySelector(".qrcode"), decodedText);
  };

  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  // If you want to prefer front camera
  html5QrCode.start({
    facingMode: "user"
  },
    config,
    qrCodeSuccessCallback
  );
}
