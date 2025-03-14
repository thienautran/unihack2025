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
import { getGameList, getGamePrompt } from './actions';

export default async function Home() {
  const list = await getGameList();
  console.log(list);

  const prompt = await getGamePrompt('1234');
  console.log(prompt);

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
