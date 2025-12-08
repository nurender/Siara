const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  uploadMedia,
  uploadMultipleMedia,
  getAllMedia,
  getMedia,
  updateMedia,
  deleteMedia,
  deleteMultipleMedia,
  getFolders,
  createFolder
} = require('../controllers/mediaController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
const fs = require('fs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large. Max 10MB allowed.' });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

// Routes (all protected for admin)
router.get('/folders', authMiddleware, adminMiddleware, getFolders);
router.post('/folders', authMiddleware, adminMiddleware, createFolder);
router.get('/', authMiddleware, adminMiddleware, getAllMedia);
router.get('/:id', authMiddleware, adminMiddleware, getMedia);
router.post('/upload', authMiddleware, upload.single('file'), handleMulterError, uploadMedia);
router.post('/upload-multiple', authMiddleware, upload.array('files', 20), handleMulterError, uploadMultipleMedia);
router.put('/:id', authMiddleware, adminMiddleware, updateMedia);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMedia);
router.post('/delete-multiple', authMiddleware, adminMiddleware, deleteMultipleMedia);

module.exports = router;

