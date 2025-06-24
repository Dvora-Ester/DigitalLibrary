// storage_for_images.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const imageFolder = path.join(process.cwd(), 'pictures_of_books');

if (!fs.existsSync(imageFolder)) {
  fs.mkdirSync(imageFolder, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageFolder);
  },
  filename: (req, file, cb) => {
    // שם זמני – נעשה לו rename לפי ה־bookId אחרי השמירה
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // עד 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed (jpg, png, webp)'));
    }
    cb(null, true);
  }
});

export default imageUpload;
