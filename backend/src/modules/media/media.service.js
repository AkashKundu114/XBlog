const { v2: cloudinary } = require('cloudinary');
const { env } = require('../../config/env');

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

class MediaService {
  uploadImage(fileBuffer, folder = 'blog') {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      ).end(fileBuffer);
    });
  }

  deleteImage(publicId) {
    return cloudinary.uploader.destroy(publicId);
  }

  getSignedUploadParams(folder = 'blog') {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, env.CLOUDINARY_API_SECRET || '');
    return { timestamp, signature, cloudName: env.CLOUDINARY_CLOUD_NAME, apiKey: env.CLOUDINARY_API_KEY, folder };
  }
}
const mediaService = new MediaService();
module.exports = { mediaService };
