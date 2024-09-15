// all are steps available in docs multer-storage-cloudinary

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// cloudinary.config -> docs-> cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wonderlust_DEV",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

//export
module.exports = {
  cloudinary,
  storage,
};
