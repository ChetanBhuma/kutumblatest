import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authenticate';

export class OfficerDashboardController {
    /**
     * Helper to get scoping filter
     */
    private static getScopeFilter(officer: { beatId?: string | null, policeStationId: string }) {
        if (officer.beatId) {
            return { beatId: officer.beatId };
        }
        return { policeStationId: officer.policeStationId };
    }

    /**
     * Get dashboard metrics (Assigned vs Completed, etc.)
     */
    static async getMetrics(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new AppError('Authentication required', 401);

            const officer = await prisma.beatOfficer.findFirst({
                where: { user: { id: req.user.id } }
            });

            if (!officer) throw new AppError('Officer profile not found', 404);

            const scopeFilter = OfficerDashboardController.getScopeFilter(officer);

            const [
                assigned,
                completed,
                pending,
                totalCitizens
            ] = await Promise.all([
                prisma.visit.count({
                    where: {
                        officerId: officer.id,
                        status: 'SCHEDULED'
                    }
                }),
                prisma.visit.count({
                    where: {
                        officerId: officer.id,
                        status: 'COMPLETED'
                    }
                }),
                prisma.visit.count({
                    where: {
                        officerId: officer.id,
                        status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
                    }
                }),
                prisma.seniorCitizen.count({
                    where: {
                        ...scopeFilter,
                        isActive: true
                    }
                })
            ]);

            res.json({
                success: true,
                data: {
                    metrics: {
                        assigned,
                        completed,
                        pending,
                        totalCitizens
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get visit suggestions (prioritized by risk and duration)
     */
    static async getSuggestions(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new AppError('Authentication required', 401);

            const officer = await prisma.beatOfficer.findFirst({
                where: { user: { id: req.user.id } }
            });

            if (!officer) throw new AppError('Officer profile not found', 404);

            const scopeFilter = OfficerDashboardController.getScopeFilter(officer);

            // Logic:
            // 1. High vulnerability citizens in beat who haven't been visited recently.
            // 2. Scheduled visits that are overdue.

            const suggestions = await prisma.seniorCitizen.findMany({
                where: {
                    ...scopeFilter,
                    isActive: true,
                    // Filter those who need visits
                    OR: [
                        { lastVisitDate: null },
                        { lastVisitDate: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } // > 30 days
                    ]
                },
                orderBy: [
                    { vulnerabilityLevel: 'desc' }, // High first
                    { lastVisitDate: 'asc' } // Oldest visit first
                ],
                take: 20,
                select: {
                    id: true,
                    fullName: true,
                    vulnerabilityLevel: true,
                    lastVisitDate: true,
                    permanentAddress: true,
                    mobileNumber: true,
                    gpsLatitude: true,
                    gpsLongitude: true
                }
            });

            // Custom sort for vulnerability level
            const severityMap: Record<string, number> = {
                'Critical': 4,
                'High': 3,
                'Moderate': 2,
                'Low': 1
            };

            const sortedSuggestions = suggestions.sort((a, b) => {
                const scoreA = severityMap[a.vulnerabilityLevel || 'Low'] || 0;
                const scoreB = severityMap[b.vulnerabilityLevel || 'Low'] || 0;

                if (scoreA !== scoreB) {
                    return scoreB - scoreA; // Descending severity
                }

                // If severity same, prioritize older visit date (or null)
                const dateA = a.lastVisitDate ? new Date(a.lastVisitDate).getTime() : 0;
                const dateB = b.lastVisitDate ? new Date(b.lastVisitDate).getTime() : 0;

                return dateA - dateB; // Ascending date (0/null comes first)
            }).slice(0, 5);

            res.json({
                success: true,
                data: { suggestions: sortedSuggestions }
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get nearby citizens for Map View
     */
    static async getNearbyCitizens(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new AppError('Authentication required', 401);

            const officer = await prisma.beatOfficer.findFirst({
                where: { user: { id: req.user.id } }
            });

            if (!officer) throw new AppError('Officer profile not found', 404);

            const scopeFilter = OfficerDashboardController.getScopeFilter(officer);

            // Get all citizens in the officer's beat with GPS coordinates
            const citizens = await prisma.seniorCitizen.findMany({
                where: {
                    ...scopeFilter,
                    isActive: true,
                    gpsLatitude: { not: null },
                    gpsLongitude: { not: null }
                },
                select: {
                    id: true,
                    fullName: true,
                    vulnerabilityLevel: true,
                    gpsLatitude: true,
                    gpsLongitude: true,
                    permanentAddress: true,
                    mobileNumber: true,
                    photoUrl: true
                }
            });

            res.json({
                success: true,
                data: { citizens }
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get officer profile
     */
    static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new AppError('Authentication required', 401);

            const officer = await prisma.beatOfficer.findFirst({
                where: { user: { id: req.user.id } },
                include: {
                    PoliceStation: { select: { name: true } },
                    Beat: { select: { name: true } }
                }
            });

            if (!officer) throw new AppError('Officer profile not found', 404);

            res.json({
                success: true,
                data: { officer }
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get citizens in the officer's beat (Paginated list for "My Beat" view)
     */
    static async getMyBeatCitizens(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new AppError('Authentication required', 401);

            const officer = await prisma.beatOfficer.findFirst({
                where: { user: { id: req.user.id } }
            });

            if (!officer) throw new AppError('Officer profile not found', 404);

            const scopeFilter = OfficerDashboardController.getScopeFilter(officer);

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const search = req.query.search ? String(req.query.search) : undefined;

            const whereClause: any = {
                ...scopeFilter,
                isActive: true
            };

            if (search) {
                whereClause.OR = [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { mobileNumber: { contains: search } }
                ];
            }

            const [citizens, total] = await Promise.all([
                prisma.seniorCitizen.findMany({
                    where: whereClause,
                    skip,
                    take: limit,
                    orderBy: { fullName: 'asc' },
                    select: {
                        id: true,
                        fullName: true,
                        mobileNumber: true,
                        permanentAddress: true,
                        gpsLatitude: true,
                        gpsLongitude: true,
                        vulnerabilityLevel: true,
                        photoUrl: true,
                        status: true
                    }
                }),
                prisma.seniorCitizen.count({ where: whereClause })
            ]);

            res.json({
                success: true,
                data: {
                    citizens,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                }
            });

        } catch (error) {
            next(error);
        }
    }
}
