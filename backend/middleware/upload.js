const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');
const multer = require('multer');

const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage || multerStorageCloudinary;

// 1. Configure with your environment variables using .v2
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Set up the storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // We pass the root object here!
  folder: "Tourly_Destinations",
  allowedFormats: ["jpg", "jpeg", "png", "webp"],
  params: {
    folder: "Tourly_Destinations",
    allowedFormats: ["jpg", "jpeg", "png", "webp"]
  }
});

// 3. Initialize multer
const upload = multer({ storage });

module.exports = upload;