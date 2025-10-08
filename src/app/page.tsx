import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MeetingControls } from '@/components/meeting-controls';
import { ParticipantVideo } from '@/components/participant-video';
import { Logo } from '@/components/logo';

const participants = [
  { id: 1, name: 'You', avatar: 'user1', isMuted: true, isSpeaking: false, isYou: true },
  { id: 2, name: 'Alice', avatar: 'user2', isMuted: false, isSpeaking: true },
  { id: 3, name: 'Bob', avatar: 'user3', isMuted: true, isSpeaking: false },
  { id: 4, name: 'Charlie', avatar: 'user4', isMuted: false, isSpeaking: false },
];

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
        <Logo />
        <div className="text-sm text-muted-foreground">
          <p>Meeting ID: 123-456-789</p>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {participants.map((participant) => {
            const imageData = PlaceHolderImages.find(p => p.id === participant.avatar);
            return (
              <ParticipantVideo
                key={participant.id}
                name={participant.name}
                avatarUrl={imageData?.imageUrl || ''}
                isMuted={participant.isMuted}
                isSpeaking={participant.isSpeaking}
                isYou={participant.isYou}
                imageHint={imageData?.imageHint || ''}
              />
            );
          })}
        </div>
      </main>
      <MeetingControls />
    </div>
  );
}
