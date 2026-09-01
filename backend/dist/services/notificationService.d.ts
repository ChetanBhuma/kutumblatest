export declare enum NotificationType {
    SMS = "SMS",
    EMAIL = "EMAIL",
    PUSH = "PUSH",
    IN_APP = "IN_APP"
}
export declare enum NotificationPriority {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export interface NotificationPayload {
    recipient: string;
    subject?: string;
    message: string;
    type: NotificationType;
    priority?: NotificationPriority;
    data?: Record<string, any>;
}
export declare class NotificationService {
    /**
     * Send SMS notification
     */
    static sendSMS(phone: string, message: string): Promise<boolean>;
    /**
     * Send Email notification
     */
    static sendEmail(to: string, subject: string, _body: string, _html?: string): Promise<boolean>;
    /**
     * Send Push notification (Firebase Cloud Messaging)
     */
    static sendPushNotification(deviceToken: string, title: string, _body: string, _data?: Record<string, any>): Promise<boolean>;
    /**
     * Send notification (multi-channel)
     */
    static send(payload: NotificationPayload): Promise<boolean>;
    /**
     * Send SOS alert notifications
     */
    static sendSOSAlert(citizenName: string, citizenPhone: string, address: string, latitude: number, longitude: number, targets: {
        officers?: {
            phone: string;
            name: string;
        }[];
        emergencyContacts?: {
            phone: string;
            name: string;
        }[];
    }): Promise<void>;
    /**
     * Send visit reminder
     */
    static sendVisitReminder(citizenPhone: string, officerName: string, visitDate: Date): Promise<void>;
    /**
     * Send visit completion notification
     */
    static sendVisitCompletionNotification(citizenPhone: string, officerName: string): Promise<void>;
    /**
     * Send OTP
     */
    static sendOTP(phone: string, otp: string): Promise<boolean>;
    /**
     * Send registration confirmation
     */
    static sendRegistrationConfirmation(phone: string, email: string | null, name: string): Promise<void>;
    /**
     * Send verification request notification
     */
    static sendVerificationRequestNotification(citizenName: string, citizenPhone: string, entityType: string): Promise<boolean>;
    /**
     * Send verification outcome notification
     */
    static sendVerificationOutcomeNotification(citizenName: string, citizenPhone: string, entityType: string, status: string): Promise<boolean>;
    /**
     * Send visit scheduled notification
     */
    static sendVisitScheduled(citizenPhone: string, citizenName: string, officerName: string, visitDate: Date, visitType: string): Promise<void>;
    /**
     * Send visit cancelled notification
     */
    static sendVisitCancelled(citizenPhone: string, citizenName: string, reason: string): Promise<void>;
    /**
     * Send officer task assignment notification
     */
    static sendOfficerTaskAssignment(officerPhone: string, citizenName: string, taskType: string, date: Date): Promise<void>;
    static createInAppNotification(data: {
        userId: string;
        title: string;
        message: string;
        type?: string;
        priority?: string;
        data?: any;
    }): Promise<{
        message: string;
        userId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        type: string;
        priority: string;
        title: string;
        isRead: boolean;
    } | null>;
    static getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: {
            message: string;
            userId: string;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            type: string;
            priority: string;
            title: string;
            isRead: boolean;
        }[];
        total: number;
        unread: number;
        pages: number;
    }>;
    static markAsRead(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    static markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    static deleteNotification(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
//# sourceMappingURL=notificationService.d.ts.map