import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authenticate';
export declare class NotificationController {
    /**
     * Send notification (admin/system use)
     */
    static sendNotification(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Send bulk notifications
     */
    static sendBulkNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Test notification
     */
    static testNotification(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user notifications
     */
    static getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Mark notification as read
     */
    static markRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Mark all notifications as read
     */
    static markAllRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete notification
     */
    static deleteNotification(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=notificationController.d.ts.map