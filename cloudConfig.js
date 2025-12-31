import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    // format: async (req, file) => 'png', // supports promises as well
    allowedFormats: ["png", "jpg", "jpeg"],
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});

export {cloudinary, storage}

