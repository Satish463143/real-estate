const multer = require('multer');
const path = require('path');

// ── Allowed image extensions ──────────────────────────────────────────────────
const ALLOWED_IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ── Multer file filter ────────────────────────────────────────────────────────
const imageFileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (ALLOWED_IMAGE_EXTS.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      Object.assign(new Error(`Unsupported file type ".${ext}". Allowed: ${ALLOWED_IMAGE_EXTS.join(', ')}`), {
        status: 422,
      })
    );
  }
};

// ── Multer instance (memory storage – buffer stays in memory, never hits disk)
const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: imageFileFilter,
});

/**
 * persistBufferToBody
 *
 * After multer finishes parsing, this middleware walks req.files and copies
 * each file's Buffer into req.body[fieldname].  The controller / service can
 * then pass it straight to Prisma (Bytes column) without any extra step.
 *
 * Behaviour per field:
 *   maxCount === 1  →  req.body[fieldname] = Buffer          (scalar)
 *   maxCount  > 1  →  req.body[fieldname] = Buffer[]        (array)
 *
 * @param {Array<{name:string, maxCount:number}>} fieldDefs  – same array passed to multer
 */
const makePersistBufferToBody = (fieldDefs = []) => (req, _res, next) => {
  try {
    if (!req.body) req.body = {}

    // Build a lookup: fieldname → declared maxCount
    const maxCountMap = {}
    for (const f of fieldDefs) maxCountMap[f.name] = f.maxCount || 1

    // req.files is an object keyed by fieldname when using .fields()
    if (req.files && !Array.isArray(req.files)) {
      for (const [fieldname, fileArr] of Object.entries(req.files)) {
        if (!Array.isArray(fileArr) || fileArr.length === 0) continue

        const declaredMax = maxCountMap[fieldname] || 1
        if (declaredMax === 1) {
          // Single-image field → scalar Buffer
          req.body[fieldname] = fileArr[0].buffer
        } else {
          // Multi-image field → array of Buffers
          req.body[fieldname] = fileArr.map((f) => f.buffer)
        }
      }
    }

    // req.file is set when using .single()
    if (req.file) {
      req.body[req.file.fieldname] = req.file.buffer
    }

    next()
  } catch (err) {
    next(err)
  }
}

/**
 * uploadImage(fields)
 *
 * Returns a composed middleware array:
 *   [multer().fields(fields), persistBufferToBody]
 *
 * @param {Array<{name: string, maxCount: number}>} fields
 */
const uploadImage = (fields = []) => [
  multerInstance.fields(fields),
  makePersistBufferToBody(fields),
]

/**
 * uploadSingleImage(fieldname)
 *
 * Convenience helper for a single image field.
 * @param {string} fieldname
 */
const uploadSingleImage = (fieldname = 'image') => [
  multerInstance.single(fieldname),
  makePersistBufferToBody([{ name: fieldname, maxCount: 1 }]),
]

module.exports = { uploadImage, uploadSingleImage };
