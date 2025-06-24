// middleware/uploadBoth.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const pdfFolder = path.join(process.cwd(), 'books_storage');
const imageFolder = path.join(process.cwd(), 'pictures_of_books');

if (!fs.existsSync(pdfFolder)) fs.mkdirSync(pdfFolder, { recursive: true });
if (!fs.existsSync(imageFolder)) fs.mkdirSync(imageFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, pdfFolder);
    } else {
      cb(null, imageFolder);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const uploadBoth = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedPdf = ['application/pdf'];
    const allowedImages = ['image/jpeg', 'image/png', 'image/webp'];
    if (![...allowedPdf, ...allowedImages].includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  }
});

export default uploadBoth;
