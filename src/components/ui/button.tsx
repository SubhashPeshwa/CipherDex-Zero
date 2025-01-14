import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default',
  className = '',
  children,
  ...props 
}) => {
  const baseStyles = 'px-4 py-2 rounded-md transition-colors duration-200 font-medium';
  const variantStyles = {
    default: 'bg-green-500 text-black hover:bg-green-600',
    outline: 'border border-green-500 text-green-500 hover:bg-green-500 hover:text-black'
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}; 