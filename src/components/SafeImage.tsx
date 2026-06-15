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
        <div className="absolute inset-0 flex items-center justify-center bg-[#1A1118]">
          <div className="w-6 h-6 border-2 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin" />
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A1118] gap-1">
          <div className="w-6 h-6 border-2 border-gray-600/20 border-t-gray-600 rounded-full animate-spin mb-1" />
          <ImageOff className="h-4 w-4 text-gray-600" />
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
