import { Video } from 'lucide-react';

export function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 text-xl font-bold">
      <div className="rounded-lg bg-primary p-2">
        <Video className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-primary">MeetUpGo</span>
    </a>
  );
}
