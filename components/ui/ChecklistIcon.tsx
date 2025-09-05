
import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ChecklistIconProps {
    status: 'cumplido' | 'parcial' | 'no_encontrado' | 'correcto' | 'advertencia' | 'error';
}

const ChecklistIcon: React.FC<ChecklistIconProps> = ({ status }) => {
    switch (status) {
        case 'cumplido':
        case 'correcto':
            return <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />;
        case 'parcial':
        case 'advertencia':
            return <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />;
        case 'no_encontrado':
        case 'error':
            return <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
        default:
            return null;
    }
};

export default ChecklistIcon;
