"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type JoinMeetingDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function JoinMeetingDialog({ isOpen, onOpenChange }: JoinMeetingDialogProps) {
  const [meetingId, setMeetingId] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleJoin = () => {
    if (!meetingId.trim()) {
      toast({
        variant: 'destructive',
        title: 'Meeting ID required',
        description: 'Please enter a valid meeting ID to join.',
      });
      return;
    }
    // Simple validation for meeting ID format. e.g., xxx-xxx-xxx
    const idRegex = /^\d{3}-\d{3}-\d{3}$/;
    if (!idRegex.test(meetingId.trim())) {
        toast({
            variant: "destructive",
            title: "Invalid Meeting ID Format",
            description: "Please enter a valid ID (e.g., 123-456-789).",
        });
        return;
    }

    router.push(`/meeting/${meetingId.trim()}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a Meeting</DialogTitle>
          <DialogDescription>
            Enter the meeting ID below to join an existing meeting.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="meeting-id" className="text-right">
              Meeting ID
            </Label>
            <Input
              id="meeting-id"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="e.g. 123-456-789"
              className="col-span-3"
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleJoin}>Join Meeting</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
