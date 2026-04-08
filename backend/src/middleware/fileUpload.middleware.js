const multer = require('multer');
const path = require('path');
const {s3}  = require('../config/aws.config');
const { uploadToS3 } = require('../utils/s3.upload');
const { randomStringGenerator } = require('../utils/helper');
const { FileFilterType } = require('../config/constant.config');
require("dotenv").config();

const BUCKET = process.env.S3_BUCKET_NAME;

const generateFileName = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const code = randomStringGenerator(20);
  return `bleeding-tech-${code}${ext}`;
  
};

// ─── Filters ──────────────────────────────────────────────────────────────
const fileFilterByType = (allowed) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('File format not supported'));
};


// ─── Persist uploaded files from memory to S3 ────────────────────────────
// This middleware uploads all files in req.file / req.files to S3 and
// mutates each file object to include .location, .key, .bucket
async function persistAllToS3(req, res, next) {
  try {
    const folder = req.uploadPath || 'uploads';

    // normalize to an array-of-arrays to iterate consistently
    const fieldEntries = [];
    if (req.file) fieldEntries.push(['file', [req.file]]);
    if (req.files && !Array.isArray(req.files)) {
      for (const [field, arr] of Object.entries(req.files)) {
        if (Array.isArray(arr) && arr.length) fieldEntries.push([field, arr]);
      }
    } else if (Array.isArray(req.files) && req.files.length) {
      fieldEntries.push(['files', req.files]);
    }

    for (const [, files] of fieldEntries) {
      for (const file of files) {
        const Key = `${folder}/${generateFileName(file)}`;
        const ContentType = file.mimetype || 'application/octet-stream';

        const { url, key, bucket } = await uploadToS3({
          s3,
          Bucket: BUCKET,
          Key,
          Body: file.buffer,         // buffer because we used memoryStorage
          ContentType,
          // CacheControl: 'public, max-age=31536000',
          // ACL: 'public-read',      // only if you want public objects
        });

        // emulate multer-s3 fields so your controllers continue to work
        file.key = key;
        file.bucket = bucket;
        file.location = url;

        // 🔥 CRITICAL: map file URLs to req.body
        if (!req.body) req.body = {};
        req.body[file.fieldname] = url;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
}

// ─── Public API (keeps your old function names) ──────────────────────────
const uplaodFile = (fileType = FileFilterType.IMAGE) => {
  let allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  if (fileType === FileFilterType.DOCUMENT) {
    allowed = ['pdf', 'txt', 'doc', 'docx'];
  } else if (fileType === FileFilterType.VIDEO) {
    allowed = ['mp4', 'mov', 'mkv'];
  } else if (Array.isArray(fileType) && fileType.includes('image') && fileType.includes('video')) {
    // Handle IMAGE_VIDEO type - allow both images and videos
    allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'mkv', 'avi', 'webm'];
  }

  const filter = fileFilterByType(allowed);

  // Single/multiple dynamic usage:
  // You can still choose .single('field') / .array('field') / .fields([...]) in your route
  // Here we return a chainable middleware: first multer, then persist to S3
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 300_000_000 }, 
    fileFilter: filter,
  });

  // By default, let the route decide single/array/fields.
  // But to keep backward compatibility (where you used uplaodFile(...) directly),
  // we’ll return a function that expects the route to choose method:
  upload.persist = persistAllToS3;
  return upload;
};


// Keep your setPath helper exactly as-is
const setPath = (folder) => (req, _res, next) => {
  req.uploadPath = folder; 
  next();
};

module.exports = {
  uplaodFile,       // usage differs slightly; see route examples below
  setPath,
  persistAllToS3,   // in case you want to compose manually
};
