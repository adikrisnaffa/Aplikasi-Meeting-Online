import { Camera } from 'lucide-react';

export function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
      <Camera className="h-6 w-6" />
      <span className="font-headline">MeetUpGo</span>
    </a>
  );
}
