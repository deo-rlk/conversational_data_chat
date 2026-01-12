import React from 'react';
import { Button } from '@/components/ui/Button';

interface ConfirmButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function ConfirmButton({ children = 'Confirmar', ...props }: ConfirmButtonProps) {
  return (
    <Button {...props} className="bg-green-600 hover:bg-green-700 text-white" aria-label="Confirmar">
      {children}
      <svg
        className="ml-2 w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </Button>
  );
}
