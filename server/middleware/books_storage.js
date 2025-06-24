import multer from 'multer';
import path from 'path';
import fs from 'fs';

// const uploadFolder = 'books_storage/';
// const uploadFolder = path.join(process.cwd(), 'server', 'books_storage');
// ...existing code...
const uploadFolder = path.join(process.cwd(), 'books_storage'); // או 'server/books_storage' אם צריך
// ...existing code...

// יצירת התיקייה אם היא לא קיימת
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// const storage = multer.diskStorage({

//   destination: (req, file, cb) => {
//     cb(null, uploadFolder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   }
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📂 destination function called – saving to:", uploadFolder);
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fullName = uniqueName + path.extname(file.originalname);
    console.log("📛 Saving file as:", fullName);
    cb(null, fullName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['application/pdf'];
//     if (!allowedTypes.includes(file.mimetype)) {
//       return cb(new Error('Only PDF files are allowed'));
//     }
//     cb(null, true);
//   }
fileFilter: (req, file, cb) => {
  console.log("🔍 Checking file type:", file.mimetype);
  const allowedTypes = ['application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    console.log("❌ File rejected:", file.originalname);
    return cb(new Error('Only PDF files are allowed'));
  }
  console.log("✅ File accepted:", file.originalname);
  cb(null, true);
}

});

export default upload;
