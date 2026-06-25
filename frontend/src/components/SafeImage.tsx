import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  referrerPolicy?: 'no-referrer' | 'origin' | 'strict-origin' | 'no-referrer-when-downgrade' | 'same-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
}

export default function SafeImage({
  src, alt, className = '', wrapperClassName = '', referrerPolicy, loading = 'lazy', onClick
}: SafeImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');

  if (!src) {
    return (
      <div className={`relative overflow-hidden ${wrapperClassName}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-[#1A1118] gap-1.5">
          <ImageOff className="h-5 w-5 text-gray-400 dark:text-gray-600" />
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">No Photo</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin" />
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-[#1A1118] gap-1.5">
          <ImageOff className="h-5 w-5 text-gray-400 dark:text-gray-600" />
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">No Photo</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${status !== 'loaded' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        referrerPolicy={referrerPolicy}
        loading={loading}
        onClick={onClick}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </div>
  );
}
