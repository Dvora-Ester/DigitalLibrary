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
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // 📁 הגדרת תיקיות קלט
// const pdfFolder = path.join(process.cwd(), 'books_storage');
// const imageFolder = path.join(process.cwd(), 'pictures_of_books');

// // 📂 יצירת תיקיות אם הן לא קיימות
// for (const folder of [pdfFolder, imageFolder]) {
//   if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
// }

// // 🧠 פונקציה לקביעת תיקיית יעד לפי סוג הקובץ
// const getDestination = (mimetype) => {
//   if (mimetype === 'application/pdf') return pdfFolder;
//   if (['image/jpeg', 'image/png', 'image/webp'].includes(mimetype)) return imageFolder;
//   return null;
// };

// // 📦 הגדרת storage של multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dest = getDestination(file.mimetype);
//     if (!dest) return cb(new Error('Unsupported file type'), null);
//     cb(null, dest);
//   },
//   filename: (req, file, cb) => {
//     const timestamp = Date.now();
//     const random = Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, `${timestamp}-${random}${ext}`);
//   }
// });

// // 📤 העלאה בפועל עם הגבלות
// const uploadBoth = multer({
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB לכל קובץ
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedMimeTypes = [
//       'application/pdf',
//       'image/jpeg',
//       'image/png',
//       'image/webp'
//     ];
//     if (!allowedMimeTypes.includes(file.mimetype)) {
//       return cb(new Error('סוג קובץ לא נתמך'), false);
//     }
//     cb(null, true);
//   }
// });

// export default uploadBoth;
