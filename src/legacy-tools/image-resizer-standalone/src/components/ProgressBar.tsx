import React from 'react';

interface ProgressBarProps {
    progress: number;
    message: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, message }) => {
    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in">
            <div className="text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-gray-100 dark:text-gray-800"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={364.42}
                            strokeDashoffset={364.42 * (1 - progress / 100)}
                            className="text-blue-600 transition-all duration-300"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="absolute text-3xl font-black text-gray-900 dark:text-white">{progress}%</span>
                </div>
                <h3 className="text-xl font-black text-blue-600 tracking-tight flex items-center justify-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    {message}
                </h3>
            </div>

            <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-1">
                <div
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[shimmer_1s_linear_infinite]" />
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    from { background-position: 0 0; }
                    to { background-position: 1rem 0; }
                }
            `}</style>
        </div>
    );
};

export default ProgressBar;
