import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type ParticipantVideoProps = {
  name: string;
  avatarUrl: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isYou?: boolean;
  imageHint: string;
};

export function ParticipantVideo({
  name,
  avatarUrl,
  isMuted,
  isSpeaking,
  isYou = false,
  imageHint
}: ParticipantVideoProps) {
  return (
    <Card
      className={cn(
        'relative aspect-video overflow-hidden rounded-xl shadow-lg transition-all duration-300',
        isSpeaking && !isMuted ? 'ring-4 ring-accent ring-offset-2 ring-offset-background' : 'ring-0'
      )}
    >
      <div className="flex h-full w-full items-center justify-center bg-muted/50">
        <Avatar className="h-24 w-24 text-4xl lg:h-32 lg:w-32">
          <AvatarImage src={avatarUrl} alt={name} data-ai-hint={imageHint} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3">
        <span className="text-sm font-medium text-primary-foreground drop-shadow-md">
          {name} {isYou && '(You)'}
        </span>
        <div className="rounded-full bg-black/30 p-1.5 backdrop-blur-sm">
          {isMuted ? (
            <MicOff className="h-4 w-4 text-primary-foreground" />
          ) : (
            <Mic className="h-4 w-4 text-primary-foreground" />
          )}
        </div>
      </div>
    </Card>
  );
}
