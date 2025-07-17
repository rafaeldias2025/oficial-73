import React from 'react';
import { cn } from '@/lib/utils';

interface ModernLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ 
  children, 
  className,
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'glass-card';
      case 'gradient':
        return 'gradient-primary';
      default:
        return 'bg-background';
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-300",
      getVariantClasses(),
      className
    )}>
      <div className="relative">
        {/* Background effects */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--accent)_0%,_transparent_50%)] opacity-5" />
        </div>
        
        {children}
      </div>
    </div>
  );
};