'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function LobbyPage() {
  const [newMeetingName, setNewMeetingName] = useState('');
  const [joinMeetingId, setJoinMeetingId] = useState('');
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

  const handleJoinMeeting = () => {
    if (!joinMeetingId) {
      toast({
        variant: "destructive",
        title: "Meeting ID is required",
        description: "Please enter a meeting ID to join.",
      });
      return;
    }
    // Basic validation for meeting ID format
    if (!/^\d{3}-\d{3}-\d{3}$/.test(joinMeetingId)) {
        toast({
            variant: "destructive",
            title: "Invalid Meeting ID format",
            description: "Please enter a valid ID (e.g., 123-456-789).",
        });
        return;
    }
    router.push(`/meeting/${joinMeetingId}`);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <Tabs defaultValue="new" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">New Meeting</TabsTrigger>
            <TabsTrigger value="join">Join Meeting</TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            <Card>
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
          </TabsContent>
          <TabsContent value="join">
            <Card>
              <CardHeader>
                <CardTitle>Join an Existing Meeting</CardTitle>
                <CardDescription>Enter the meeting ID to join.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meeting-id">Meeting ID</Label>
                  <Input
                    id="meeting-id"
                    placeholder="E.g. 123-456-789"
                    value={joinMeetingId}
                    onChange={(e) => setJoinMeetingId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoinMeeting()}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleJoinMeeting}>Join Meeting</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
