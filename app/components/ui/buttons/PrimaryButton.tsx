import { ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const PrimaryButton = ({ 
  children, 
  className = '', 
  fullWidth = false,
  ...props 
}: PrimaryButtonProps) => {
  return (
    <button
      className={`
        group relative px-6 sm:px-8 py-3 sm:py-4 
        bg-gradient-to-r from-[#654222] to-[#654222] 
        text-white rounded-xl font-medium 
        transition-all duration-300 transform 
        hover:translate-y-[-2px] hover:shadow-lg 
        ${fullWidth ? 'w-full' : 'w-auto'} 
        hover:opacity-90
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
    </button>
  );
};

export default PrimaryButton; 