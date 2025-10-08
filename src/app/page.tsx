'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function LobbyPage() {
  const [newMeetingName, setNewMeetingName] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const generateMeetingId = () => {
    const part1 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const part2 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const part3 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${part1}-${part2}-${part3}`;
  };

  const handleCreateMeeting = () => {
    if (!newMeetingName) {
      toast({
        variant: "destructive",
        title: "Meeting name is required",
        description: "Please enter a name for your new meeting.",
      });
      return;
    }
    const meetingId = generateMeetingId();
    router.push(`/meeting/${meetingId}?name=${encodeURIComponent(newMeetingName)}`);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create a New Meeting</CardTitle>
            <CardDescription>Enter a name for your meeting to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-name">Meeting Name</Label>
              <Input
                id="meeting-name"
                placeholder="E.g. Weekly Sync"
                value={newMeetingName}
                onChange={(e) => setNewMeetingName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateMeeting()}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCreateMeeting}>Create and Start Meeting</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
