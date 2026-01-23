'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

type Step = 'start' | 'otp';

interface RegistrationRecord {
    id: string;
    mobileNumber: string;
    fullName?: string;
    otpVerified: boolean;
    status: string;
    registrationStep?: string;
    draftData?: Record<string, any>;
    citizen?: { id: string };
}

function RegistrationContent() {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const [step, setStep] = useState<Step>('start');
    const [registration, setRegistration] = useState<RegistrationRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const [startForm, setStartForm] = useState({
        mobileNumber: '',
        fullName: '',
        dateOfBirth: ''
    });
    const [showDisclaimer, setShowDisclaimer] = useState(false);



    const normalizeMobileNumber = (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length === 10) {
            return `+91${digits}`;
        }
        if (digits.length === 12 && digits.startsWith('91')) {
            return `+${digits}`;
        }
        if (digits.length === 13 && digits.startsWith('091')) {
            return `+${digits.slice(1)}`;
        }
        return value;
    };

    // Auto-fill mobile number from URL parameter
    useEffect(() => {
        const mobileFromUrl = searchParams.get('mobile');
        if (mobileFromUrl) {
            // Clean and validate the mobile number
            const cleanedMobile = mobileFromUrl.replace(/\D/g, '').slice(0, 10);
            if (cleanedMobile.length === 10) {
                setStartForm(prev => ({
                    ...prev,
                    mobileNumber: cleanedMobile
                }));
            }
        }
    }, [searchParams]);

    // Cleaned up unused effects and fetchRegistration logic
    useEffect(() => {
        // Clear any stale registration ID on mount to ensure fresh start
        localStorage.removeItem('citizenPortalRegistrationId');
    }, []);

    const handleStart = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setLoading(true);
            setError('');
            const formattedMobile = normalizeMobileNumber(startForm.mobileNumber);
            if (!/^\+?91?[6-9]\d{9}$/.test(formattedMobile)) {
                setError('Enter a valid 10-digit Indian mobile number.');
                return;
            }
            if (!startForm.dateOfBirth) {
                setError('Please enter your Date of Birth.');
                return;
            }

            // Show disclaimer before proceeding
            setShowDisclaimer(true);
        } catch (err: any) {
            console.error(err);
            setError(err?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDisclaimerAccept = async () => {
        try {
            setLoading(true);
            setError('');
            setShowDisclaimer(false);

            const formattedMobile = normalizeMobileNumber(startForm.mobileNumber);
            const response = await apiClient.startCitizenRegistration({
                mobileNumber: formattedMobile,
                fullName: startForm.fullName,
                // @ts-ignore - backend supports it now
                dateOfBirth: startForm.dateOfBirth
            });

            if (response.success) {
                setRegistration(response.data.registration);
                localStorage.setItem('citizenPortalRegistrationId', response.data.registration.id);
                setStep('otp');

                // Log OTP for debugging
                if (response.data.otp) {
                    console.log('%c[DEBUG] OTP:', 'color: blue; font-weight: bold; font-size: 14px;', response.data.otp);
                }

                toast({ title: 'OTP sent', description: 'Please check your mobile for the OTP.' });
            }
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || 'Unable to start registration');
            setShowDisclaimer(false); // Re-show form on error
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerification = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!registration) return;
        try {
            setLoading(true);
            setError('');
            // Verify OTP with backend - this now returns tokens and logs user in
            await apiClient.verifyCitizenRegistrationOTP(registration.id, otp);

            toast({ title: 'Verified', description: 'Registration successful.' });

            // Redirect to dashboard after successful registration
            window.location.href = '/citizen-portal/dashboard';
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };



    const steps: Array<{ id: Step; label: string; description: string }> = [
        { id: 'start', label: 'Mobile & DOB', description: 'Basic info' },
        { id: 'otp', label: 'OTP', description: 'Verify number' }
    ];
    const activeIndex = Math.max(0, steps.findIndex((s) => s.id === step));
    const progressPercent = Math.min(100, (activeIndex / (steps.length - 1)) * 100);

    const renderStep = () => {
        switch (step) {
            case 'start':
                return (
                    <>
                        <form onSubmit={handleStart} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-6 text-lg text-blue-900 leading-relaxed">
                                <p className="font-medium">Welcome to the Delhi Police Senior Citizen Cell.</p>
                                <p className="mt-2">
                                    Enter your mobile number and date of birth to get started.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xl font-bold text-slate-900">Mobile Number</Label>
                                <Input
                                    value={startForm.mobileNumber}
                                    onChange={(e) => setStartForm((prev) => ({ ...prev, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                                    placeholder="e.g., 98765 43210"
                                    className="h-16 text-2xl tracking-wide border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-lg"
                                    required
                                    type="tel"
                                    maxLength={10}
                                    autoComplete="tel"
                                />
                                <p className="text-base text-slate-600">Enter your 10-digit mobile number.</p>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xl font-bold text-slate-900">Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={startForm.dateOfBirth}
                                    onChange={(e) => setStartForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                                    className="h-16 text-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-lg"
                                    required
                                />
                                <p className="text-base text-slate-600">You must be 60 years or older.</p>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xl font-bold text-slate-900">Full Name (Optional)</Label>
                                <Input
                                    value={startForm.fullName}
                                    onChange={(e) => setStartForm((prev) => ({ ...prev, fullName: e.target.value }))}
                                    placeholder="Your Name"
                                    className="h-16 text-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-lg"
                                    autoComplete="name"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 text-xl font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-md transition-all hover:scale-[1.01]"
                            >
                                {loading ? 'Processing...' : 'Next'}
                            </Button>
                        </form>

                        {/* Disclaimer Modal */}
                        {showDisclaimer && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Relevant Information</h3>
                                    <div className="space-y-4 text-lg text-slate-700 mb-8">
                                        <p className="font-medium text-slate-900">Please read and check both conditions before proceeding:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Person aged 60 years or above and residing alone or only with spouse.</li>
                                            <li>Person aged 60 years or above though living with family but remain alone for a long time during daytime.</li>
                                        </ul>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button
                                            onClick={() => setShowDisclaimer(false)}
                                            variant="outline"
                                            className="flex-1 h-14 text-lg font-semibold border-2"
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            onClick={handleDisclaimerAccept}
                                            className="flex-1 h-14 text-lg font-bold bg-blue-700 hover:bg-blue-800 text-white"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                );
            case 'otp':
                return (
                    <form onSubmit={handleOtpVerification} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-lg text-slate-700">
                            We have sent a 6-digit code to <span className="font-bold text-slate-900">{startForm.mobileNumber || registration?.mobileNumber}</span>.
                        </div>

                        <div className="space-y-4">
                            <Label className="text-xl font-bold text-slate-900">Enter Verification Code (OTP)</Label>
                            <Input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter 6-digit code"
                                className="h-16 text-2xl tracking-[0.5em] font-mono text-center border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-lg"
                                required
                                maxLength={6}
                                autoComplete="one-time-code"
                            />
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-16 text-xl font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-md"
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep('start')}
                                disabled={loading}
                                className="flex-1 h-16 text-xl font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg"
                            >
                                Change Mobile Number
                            </Button>
                        </div>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Senior Citizen Registration</h1>
                    <p className="text-lg text-slate-600">Delhi Police - Shanti Sewa Nyaya</p>
                </div>

                <Card className="border-0 shadow-xl overflow-hidden rounded-2xl">
                    <div className="bg-blue-700 p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">
                                {step === 'start' && 'Step 1: Contact Info'}
                                {step === 'otp' && 'Step 2: Verification'}
                            </h2>

                        </div>

                        {/* Accessible Progress Bar */}
                        <div className="w-full bg-blue-900/30 rounded-full h-3 mb-2" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`Registration progress: ${Math.round(progressPercent)}%`}>
                            <div
                                className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    <CardContent className="p-6 sm:p-10 bg-white">
                        {error && (
                            <Alert variant="destructive" className="mb-8 border-2 border-red-200 bg-red-50">
                                <AlertDescription className="text-lg font-medium text-red-800 flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}
                        {renderStep()}
                    </CardContent>
                </Card>

                <p className="text-center text-slate-500 mt-8 text-sm">
                    Need help? Call Senior Citizen Helpline: <a href="tel:1291" className="font-bold text-blue-700 hover:underline text-lg">1291</a>
                </p>
            </div>
        </div>
    );
}

export default function CitizenRegistrationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        }>
            <RegistrationContent />
        </Suspense>
    );
}
