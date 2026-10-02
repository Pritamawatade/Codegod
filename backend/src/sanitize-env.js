// Run before any module imports cloudinary. The SDK throws if CLOUDINARY_URL is set
// but not a full cloudinary://... URL (common with placeholder values in .env).
const url = process.env.CLOUDINARY_URL;
if (typeof url === 'string' && url.length > 0 && !url.startsWith('cloudinary://')) {
  delete process.env.CLOUDINARY_URL;
}
