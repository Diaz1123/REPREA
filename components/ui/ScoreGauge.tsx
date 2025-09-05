
import React from 'react';

interface ScoreGaugeProps {
    score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
    const color = score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500';
    return (
        <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full"></div>
            <div className="relative text-center">
                <span className={`text-4xl font-bold ${color}`}>{score}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">/ 100</span>
            </div>
        </div>
    );
};

export default ScoreGauge;
