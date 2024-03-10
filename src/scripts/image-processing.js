  const imageCanvas = document.getElementById('image-processing');
  const imageCtx = imageCanvas.getContext('2d');


const devilnetfont = new FontFace('Devilnet', 'url(./fonts/Devilnet.ttf)');

devilnetfont.load().then((font) => {
  document.fonts.add(font);
  imageCtx.font = '20px Devilnet';
  imageCtx.fillStyle = 'purple';
  const text = 'Leopard Steganography Decoder';
  const textWidth = imageCtx.measureText(text).width;
  const canvasWidth = imageCanvas.width;
  const x = (canvasWidth - textWidth) / 2;
  const y = canvas.height / 2;
  imageCtx.fillText(text, x, y);
});



