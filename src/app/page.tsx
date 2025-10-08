'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';

export default function LobbyPage() {
  const [meetingName, setMeetingName] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const generateMeetingId = () => {
    const part1 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const part2 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const part3 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${part1}-${part2}-${part3}`;
  };

  const handleCreateMeeting = () => {
    if (!meetingName.trim()) {
      toast({
        variant: "destructive",
        title: "Meeting name required",
        description: "Please enter a name for your meeting.",
      });
      return;
    }
    const meetingId = generateMeetingId();
    router.push(`/meeting/${meetingId}?name=${encodeURIComponent(meetingName)}`);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
            <div className="flex justify-center items-center mb-4">
                <Logo />
            </div>
          <h1 className="text-3xl font-bold">Video Conferencing</h1>
          <p className="text-muted-foreground">Start or join a meeting instantly.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Create a New Meeting</CardTitle>
            <CardDescription>Give your meeting a name to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="meeting-name">Meeting Name</Label>
              <Input
                id="meeting-name"
                placeholder="e.g. Team Standup"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateMeeting()}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCreateMeeting}>
              <Video className="mr-2 h-4 w-4" /> Start Meeting
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
