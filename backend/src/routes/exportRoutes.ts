import express from 'express';
import { ExportController } from '../controllers/exportController';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/authorize';
import { Role } from '../types/auth';

const router = express.Router();

// Protect all export routes
router.use(authenticate);

// Export Citizens (CSV) - Admin, Super Admin, Data Entry
router.get(
    '/citizens',
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.DATA_ENTRY]),
    ExportController.exportCitizens
);

// Export Visits (Excel) - Admin, Super Admin, Supervisor
router.get(
    '/visits',
    requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPERVISOR]),
    ExportController.exportVisits
);

// Generate Report (PDF) - Admin, Super Admin
router.get(
    '/reports',
    requireRole([Role.ADMIN, Role.SUPER_ADMIN]),
    ExportController.generateReport
);

export default router;
