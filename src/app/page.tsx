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
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_CONVEX_URL);
  const games = useQuery(api.games.getPrompt);

  console.log('games value: is ', games?.length);
  return (
    <div className='flex flex-1 flex-col gap-4 justify-center items-center h-screen bg-slate-950 text-white'>
      <h1 className='text-4xl'>Hello Unihack</h1>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={'default'}
            className='bg-indigo-300'
          >
            Click me to reveal the sheet
          </Button>
        </SheetTrigger>
        <SheetContent side={'bottom'}>
          <SheetHeader>
            <SheetTitle>Unihack sheet</SheetTitle>
            <SheetDescription>Do stuff here</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
