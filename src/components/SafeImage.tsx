import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface SafeImageProps {
  src: string;
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
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-[#1A1118] animate-shimmer" />
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A1118] gap-1">
          <ImageOff className="h-5 w-5 text-gray-600" />
          <span className="text-[8px] text-gray-600 font-medium">No Photo</span>
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
