"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFields = exports.uploadMultiple = exports.uploadSingle = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
// Check if running in serverless environment
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
// Use /tmp for serverless (writable), ./uploads for traditional servers
const uploadDir = isServerless ? '/tmp/uploads' : path_1.default.join(process.cwd(), 'uploads');
const dirs = ['citizens', 'visits', 'documents', 'photos', 'digital-cards'];
// Create upload directories only if we have write access
dirs.forEach(dir => {
    const dirPath = path_1.default.join(uploadDir, dir);
    try {
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
    }
    catch (error) {
        // In serverless, we'll create directories on-demand
        console.warn(`Could not pre-create upload directory ${dirPath}:`, error);
    }
});
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (req, _file, cb) => {
        // req.body might not be populated yet depending on field order, so use a sensible default
        const folder = req.body.folder || 'documents';
        const destinationPath = path_1.default.join(uploadDir, folder);
        // Create folder if it doesn't exist (on-demand creation for serverless)
        try {
            if (!fs_1.default.existsSync(destinationPath)) {
                fs_1.default.mkdirSync(destinationPath, { recursive: true });
            }
            cb(null, destinationPath);
        }
        catch (error) {
            console.error('Failed to create upload directory:', error);
            cb(new Error('Upload directory not accessible'), '');
        }
    },
    filename: (_req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = crypto_1.default.randomBytes(8).toString('hex');
        const ext = path_1.default.extname(file.originalname);
        const basename = path_1.default.basename(file.originalname, ext);
        const safeBasename = basename.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${safeBasename}_${Date.now()}_${uniqueSuffix}${ext}`);
    }
});
// File filter
const fileFilter = (_req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type ${file.mimetype} not allowed`));
    }
};
// Multer configuration
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
        files: 5, // Max 5 files per request
    }
});
// Single file upload
exports.uploadSingle = exports.upload.single('file');
// Multiple files upload
exports.uploadMultiple = exports.upload.array('files', 5);
// Fields upload (different field names)
exports.uploadFields = exports.upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
]);
//# sourceMappingURL=multer.js.map