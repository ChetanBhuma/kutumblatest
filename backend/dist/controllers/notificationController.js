"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notificationService_1 = require("../services/notificationService");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../config/logger");
class NotificationController {
    /**
     * Send notification (admin/system use)
     */
    static async sendNotification(req, res, next) {
        try {
            const { recipient, subject, message, type, priority, data } = req.body;
            const success = await notificationService_1.NotificationService.send({
                recipient,
                subject,
                message,
                type,
                priority,
                data
            });
            if (!success) {
                throw new errorHandler_1.AppError('Failed to send notification', 500);
            }
            logger_1.auditLogger.info('Notification sent', {
                type,
                recipient,
                sentBy: req.user?.email,
                timestamp: new Date().toISOString()
            });
            res.json({
                success: true,
                message: 'Notification sent successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Send bulk notifications
     */
    static async sendBulkNotifications(req, res, next) {
        try {
            const { recipients, subject, message, type } = req.body;
            const results = await Promise.allSettled(recipients.map((recipient) => notificationService_1.NotificationService.send({
                recipient,
                subject,
                message,
                type,
                priority: notificationService_1.NotificationPriority.NORMAL
            })));
            const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
            const failureCount = results.length - successCount;
            logger_1.auditLogger.info('Bulk notifications sent', {
                type,
                total: recipients.length,
                success: successCount,
                failed: failureCount,
                sentBy: req.user?.email,
                timestamp: new Date().toISOString()
            });
            res.json({
                success: true,
                data: {
                    total: recipients.length,
                    sent: successCount,
                    failed: failureCount
                },
                message: `Sent ${successCount} out of ${recipients.length} notifications`
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Test notification
     */
    static async testNotification(req, res, next) {
        try {
            const { type, recipient } = req.body;
            let success = false;
            let testMessage = 'This is a test notification from Delhi Police Senior Citizen Portal';
            switch (type) {
                case notificationService_1.NotificationType.SMS:
                    success = await notificationService_1.NotificationService.sendSMS(recipient, testMessage);
                    break;
                case notificationService_1.NotificationType.EMAIL:
                    success = await notificationService_1.NotificationService.sendEmail(recipient, 'Test Notification', testMessage);
                    break;
                case notificationService_1.NotificationType.PUSH:
                    success = await notificationService_1.NotificationService.sendPushNotification(recipient, 'Test Notification', testMessage);
                    break;
                default:
                    throw new errorHandler_1.AppError('Invalid notification type', 400);
            }
            res.json({
                success,
                message: success ? 'Test notification sent successfully' : 'Failed to send test notification'
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get user notifications
     */
    static async getNotifications(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            // Check if user exists (should exist due to AuthRequest but good to be safe with !)
            if (!req.user?.id) {
                throw new errorHandler_1.AppError('User not authenticated', 401);
            }
            const result = await notificationService_1.NotificationService.getUserNotifications(req.user.id, page, limit);
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Mark notification as read
     */
    static async markRead(req, res, next) {
        try {
            const { id } = req.params;
            if (!req.user?.id)
                throw new errorHandler_1.AppError('User not authenticated', 401);
            await notificationService_1.NotificationService.markAsRead(id, req.user.id);
            res.json({ success: true, message: 'Notification marked as read' });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Mark all notifications as read
     */
    static async markAllRead(req, res, next) {
        try {
            if (!req.user?.id)
                throw new errorHandler_1.AppError('User not authenticated', 401);
            await notificationService_1.NotificationService.markAllAsRead(req.user.id);
            res.json({ success: true, message: 'All notifications marked as read' });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete notification
     */
    static async deleteNotification(req, res, next) {
        try {
            const { id } = req.params;
            if (!req.user?.id)
                throw new errorHandler_1.AppError('User not authenticated', 401);
            await notificationService_1.NotificationService.deleteNotification(id, req.user.id);
            res.json({ success: true, message: 'Notification deleted' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notificationController.js.map