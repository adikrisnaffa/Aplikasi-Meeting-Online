'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, UserPlus, Calendar } from 'lucide-react';
import { Logo } from '@/components/logo';
import { JoinMeetingDialog } from '@/components/join-meeting-dialog';

export default function LobbyPage() {
  const [meetingName, setMeetingName] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  const generateMeetingId = () => {
    const part1 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const part2 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const part3 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${part1}-${part2}-${part3}`;
  };

  const handleCreateMeeting = () => {
    const meetingId = generateMeetingId();
    // Untuk pembuatan meeting baru, kita bisa langsung arahkan atau munculkan dialog untuk nama meeting
    // Untuk simple, kita langsung buat dan arahkan.
    router.push(`/meeting/${meetingId}?name=Meeting`);
  };
  
  const handleScheduleMeeting = () => {
    toast({
        title: "Feature Coming Soon",
        description: "Scheduling meetings is not yet implemented.",
    });
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
            <div className="flex justify-center items-center mb-4">
                <Logo />
            </div>
          <h1 className="text-3xl font-bold">MeetUpGo</h1>
          <p className="text-muted-foreground">Video conferencing that's simple, secure and powerful.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button onClick={handleCreateMeeting} className="h-12 text-base">
            <Plus className="mr-2 h-5 w-5" /> New Meeting
          </Button>
          <Button onClick={() => setIsJoinDialogOpen(true)} variant="outline" className="h-12 text-base">
            <UserPlus className="mr-2 h-5 w-5" /> Join
          </Button>
          <Button onClick={handleScheduleMeeting} variant="outline" className="h-12 text-base">
            <Calendar className="mr-2 h-5 w-5" /> Schedule
          </Button>
        </div>
      </div>
      <JoinMeetingDialog isOpen={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen} />
    </div>
  );
}
