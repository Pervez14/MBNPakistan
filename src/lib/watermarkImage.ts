export async function createWatermarkedImageFile(
  originalFile: File,
  watermarkText = 'MBNPakistan.com'
): Promise<File> {
  const image = await loadImageFromFile(originalFile);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not prepare image watermark.');
  }

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const fontSize = Math.max(22, Math.min(52, canvas.width * 0.045));
  const spacingX = canvas.width * 0.42;
  const spacingY = canvas.height * 0.18;

  ctx.save();

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((-32 * Math.PI) / 180);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  ctx.font = `700 ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let y = -canvas.height; y < canvas.height * 2; y += spacingY) {
    for (let x = -canvas.width; x < canvas.width * 2; x += spacingX) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.strokeText(watermarkText, x, y);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.34)';
      ctx.fillText(watermarkText, x, y);
    }
  }

  ctx.restore();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error('Could not generate watermarked image.'));
          return;
        }

        resolve(result);
      },
      'image/jpeg',
      0.92
    );
  });

  const baseName = originalFile.name.replace(/\.[^/.]+$/, '');
  const safeName = `${baseName}-watermarked.jpg`;

  return new File([blob], safeName, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load selected image.'));
    };

    image.src = objectUrl;
  });
}
