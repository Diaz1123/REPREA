
import React from 'react';

interface ProgressBarProps {
    score: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ score }) => {
    const colorClass = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${score}%` }}></div>
        </div>
    );
};

export default ProgressBar;
