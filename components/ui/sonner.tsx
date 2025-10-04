'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-pink-50/95 group-[.toaster]:via-rose-50/95 group-[.toaster]:to-pink-50/95 group-[.toaster]:text-rose-800 group-[.toaster]:border-2 group-[.toaster]:border-pink-200/50 group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-md group-[.toaster]:font-romantic',
          description: 'group-[.toast]:text-rose-700 group-[.toast]:font-lovable group-[.toast]:opacity-85',
          actionButton:
            'group-[.toast]:bg-pink-500 group-[.toast]:text-white group-[.toast]:hover:bg-pink-600 group-[.toast]:rounded-xl group-[.toast]:font-romantic group-[.toast]:transition-all group-[.toast]:duration-300',
          cancelButton:
            'group-[.toast]:bg-rose-100 group-[.toast]:text-rose-700 group-[.toast]:hover:bg-rose-200 group-[.toast]:rounded-xl group-[.toast]:font-lovable group-[.toast]:transition-all group-[.toast]:duration-300',
          success: 'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-emerald-50/95 group-[.toaster]:via-green-50/95 group-[.toaster]:to-emerald-50/95 group-[.toaster]:text-emerald-800 group-[.toaster]:border-emerald-200/50',
          error: 'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-red-50/95 group-[.toaster]:via-rose-50/95 group-[.toaster]:to-red-50/95 group-[.toaster]:text-red-800 group-[.toaster]:border-red-200/50',
          warning: 'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-amber-50/95 group-[.toaster]:via-yellow-50/95 group-[.toaster]:to-amber-50/95 group-[.toaster]:text-amber-800 group-[.toaster]:border-amber-200/50',
          info: 'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50/95 group-[.toaster]:via-sky-50/95 group-[.toaster]:to-blue-50/95 group-[.toaster]:text-blue-800 group-[.toaster]:border-blue-200/50',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
