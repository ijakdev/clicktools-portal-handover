import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
    name: string;
    className?: string;
    size?: number;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className, size = 20 }) => {
    const IconComponent = (LucideIcons as any)[name];

    if (!IconComponent) {
        return <LucideIcons.HelpCircle className={className} size={size} />;
    }

    return <IconComponent className={className} size={size} />;
};

export default DynamicIcon;
