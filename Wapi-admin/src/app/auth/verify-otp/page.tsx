import VerifyOtpContent from "./VerifyOtpContent";
import { Suspense } from "react";

const VerifyOtpPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-2xl p-8 text-center">
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        }>
            <VerifyOtpContent />
        </Suspense>
    );
};

export default VerifyOtpPage;
