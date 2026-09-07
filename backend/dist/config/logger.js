"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const index_1 = require("./index");
// Check if running in serverless environment (Vercel has read-only filesystem)
// Force rebuild: 2026-02-02
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
// Create logs directory only if not in serverless environment
let logsDir = null;
if (!isServerless) {
    logsDir = path_1.default.resolve(index_1.config.logging.filePath);
    try {
        if (!fs_1.default.existsSync(logsDir)) {
            fs_1.default.mkdirSync(logsDir, { recursive: true });
        }
    }
    catch (error) {
        console.warn('Could not create logs directory, using console logging only:', error);
        logsDir = null;
    }
}
// Define log format
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
// Define console format for development
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
}));
// Build transports array based on environment
const loggerTransports = [];
// Add file transports only if logsDir is available
if (logsDir) {
    loggerTransports.push(new winston_1.default.transports.File({
        filename: path_1.default.join(logsDir, 'combined.log'),
        maxsize: 10485760, // 10MB
        maxFiles: 5
    }), new winston_1.default.transports.File({
        filename: path_1.default.join(logsDir, 'error.log'),
        level: 'error',
        maxsize: 10485760,
        maxFiles: 5
    }));
}
// Always add console transport
loggerTransports.push(new winston_1.default.transports.Console({
    format: index_1.config.env === 'production' ? logFormat : consoleFormat
}));
// Create logger instance
exports.logger = winston_1.default.createLogger({
    level: index_1.config.logging.level,
    format: logFormat,
    defaultMeta: { service: 'senior-citizen-portal' },
    transports: loggerTransports
});
// Build audit transports
const auditTransports = [];
// Add file transport for audit only if logsDir is available
if (logsDir) {
    auditTransports.push(new winston_1.default.transports.File({
        filename: path_1.default.join(logsDir, 'audit.log'),
        maxsize: 10485760,
        maxFiles: 10
    }));
}
// Always add console for audit in serverless
auditTransports.push(new winston_1.default.transports.Console({
    format: logFormat
}));
// Create audit logger for security events
exports.auditLogger = winston_1.default.createLogger({
    level: 'info',
    format: logFormat,
    defaultMeta: { service: 'audit' },
    transports: auditTransports
});
//# sourceMappingURL=logger.js.map