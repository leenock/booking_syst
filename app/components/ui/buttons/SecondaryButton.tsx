import { ButtonHTMLAttributes } from 'react';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const SecondaryButton = ({ 
  children, 
  className = '', 
  fullWidth = false,
  ...props 
}: SecondaryButtonProps) => {
  return (
    <button
      className={`
        px-6 sm:px-8 py-3 sm:py-4 
        border-2 border-amber-600 
        text-amber-400 
        hover:bg-amber-600/10 
        rounded-xl font-medium 
        transition-all duration-300 transform 
        hover:translate-y-[-2px] 
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
      cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton; 