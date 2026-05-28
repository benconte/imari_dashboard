import React from 'react';

interface PageWrapperProps {
  category: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  category,
  title,
  subtitle,
  actions,
  children
}) => {
  return (
    <div className="flex flex-col space-y-8 animate-fade-in">
      {/* Title Bar / Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 font-sans">
            <span>{category}</span>
            <span className="text-gray-300 font-normal">/</span>
            <span className="text-indigo-600 font-bold">{title.split(' ')[0]}</span>
          </nav>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-sans">
            {title}
          </h2>
          <p className="text-sm text-gray-500 font-sans mt-1">
            {subtitle}
          </p>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {children}
    </div>
  );
};
