// Turns a picture the user picked into a small square image.
// Everything happens in the browser: the photo isn't uploaded anywhere.

export const AVATAR_ACCEPT = 'image/png, image/jpeg, image/webp, image/gif';
const MAX_FILE_MB = 10;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Couldn't read that image. Try a JPG or PNG."));
    img.src = url;
  });
}

// Crops the middle square of the picture and shrinks it to size × size pixels.
// Returns a "data URL" (the image as text) that can go straight into <img src>.
export async function makeAvatar(file, size = 256) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    throw new Error(`That image is too big. Please choose one under ${MAX_FILE_MB} MB.`);
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - side) / 2;
    const sy = (img.naturalHeight - side) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', 0.88);
  } finally {
    URL.revokeObjectURL(url);
  }
}
