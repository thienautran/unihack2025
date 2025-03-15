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
  const test = useQuery(api.games.getGamePrompt, {
    gameId: 'j5703r868rbc0qgh9vw49z16m57c3bn2',
  });
  const games = useQuery(api.games.getGamesList);

  return (
    <div className='flex flex-1 flex-col gap-4 justify-center items-center h-screen bg-slate-950 text-white'>
      <h1 className='text-4xl'>Hello Unihack</h1>
      <p>{test?.name}</p>
      {games?.map((game, index) => {
        return (
          <>
            <p>{game.name}</p>
            <p>{game.prompt}</p>
          </>
        );
      })}
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
