"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exportController_1 = require("../controllers/exportController");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const auth_1 = require("../types/auth");
const router = express_1.default.Router();
// Protect all export routes
router.use(authenticate_1.authenticate);
// Export Citizens (CSV) - Requires REPORTS_EXPORT permission
router.get('/citizens', (0, authorize_1.requirePermission)(auth_1.Permission.REPORTS_EXPORT), exportController_1.ExportController.exportCitizens);
// Export Visits (Excel) - Requires REPORTS_EXPORT permission
router.get('/visits', (0, authorize_1.requirePermission)(auth_1.Permission.REPORTS_EXPORT), exportController_1.ExportController.exportVisits);
// Generate Report (PDF) - Admin, Super Admin
router.get('/reports', (0, authorize_1.requireRole)([auth_1.Role.ADMIN, auth_1.Role.SUPER_ADMIN]), (0, authorize_1.requirePermission)(auth_1.Permission.REPORTS_EXPORT), exportController_1.ExportController.generateReport);
exports.default = router;
//# sourceMappingURL=exportRoutes.js.map