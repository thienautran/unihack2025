'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const images = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
    '/image4.jpg'

  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Start transition
      setIsTransitioning(true);
      
      // Wait for fade out to complete before changing image
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        
        // Wait a tiny bit then start fade in
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className='relative bg-gradient-to-r from-gray-500 to-slate-700 h-screen text-white overflow-hidden'>
        <div className='absolute inset-0'>
          {images.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                currentImageIndex === index
                  ? isTransitioning
                    ? 'opacity-0'
                    : 'opacity-100'
                  : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Background Image ${index + 1}`}
                className='object-cover object-center w-full h-full'
              />
            </div>
          ))}
          <div className='absolute inset-0 bg-black opacity-50'></div>
        </div>
        
        <div className='relative z-10 flex flex-col justify-center items-center h-full text-center'>
          <h1 className='text-5xl font-bold leading-tight mb-4'>
            Welcome to Echo Deck!
          </h1>
          <p className='text-lg text-gray-300 mb-8'>
            Access card games using your camera, play with friends and family
            without barriers!
          </p>
          <Link
            href={'/home'}
            className='p-[3px] relative'
          >
            <div className='absolute inset-0 bg-gradient-to-r from-indigo-300 to-teal-500 rounded-lg' />
            <div className='px-8 py-2 bg-white/50 rounded-[6px] relative group transition duration-200 text-black hover:bg-transparent'>
              Get Started
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}