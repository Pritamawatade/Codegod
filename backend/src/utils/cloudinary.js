import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
const cloudinaryUpload = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log(error);
    return null;
  }

};

export default cloudinaryUpload;
