"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function InvitationButton() {
  const [meetingLink, setMeetingLink] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // This runs only on the client, avoiding hydration errors
    setMeetingLink(window.location.href);
  }, []);

  const handleCopy = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink);
      toast({
        title: 'Invitation Copied',
        description: 'Meeting link has been copied to your clipboard.',
      });
    } else {
       toast({
        variant: "destructive",
        title: 'Error',
        description: 'Could not copy the meeting link.',
      });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-muted-foreground hover:bg-accent/20 hover:text-foreground" onClick={handleCopy}>
          <Users className="h-6 w-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Invite Participants</p>
      </TooltipContent>
    </Tooltip>
  );
}
