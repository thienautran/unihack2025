'use client';
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
  return (
    <>
      <div className='relative bg-gradient-to-r from-gray-500 to-slate-700 h-screen text-white overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src='https://images.unsplash.com/photo-1522252234503-e356532cafd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxjb2RlfGVufDB8MHx8fDE2OTQwOTg0MTZ8MA&ixlib=rb-4.0.3&q=80&w=1080'
            alt='Background Image'
            className='object-cover object-center w-full h-full'
          />
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
            <div className='px-8 py-2  bg-white/50 rounded-[6px]  relative group transition duration-200 text-black hover:bg-transparent'>
              Get Started
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
