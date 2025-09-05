
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`rounded-xl shadow-lg p-6 bg-white dark:bg-gray-800 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
