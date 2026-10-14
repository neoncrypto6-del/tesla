import React from 'react';
import { images } from '../data/images';

type LogoProps = {tone?: 'light' | 'dark';className?: string;};

export function Logo({ tone = 'dark', className = 'h-9' }: LogoProps) {
  return (
    <img
      src={images.logo}
      alt="TACYE"
      className={`${className} w-auto select-none transition-[filter] duration-200 ${
      tone === 'light' ? 'invert mix-blend-screen' : 'mix-blend-multiply'}`
      }
      draggable={false} />);


}