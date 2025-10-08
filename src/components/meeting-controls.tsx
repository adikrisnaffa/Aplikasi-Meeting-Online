"use client";

import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, ScreenShare, CircleDot, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InvitationButton } from './invitation-button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

type MeetingControlsProps = {
  isScreenSharing: boolean;
  onToggleScreenShare: () => void;
  isVideoOff: boolean;
  onToggleVideo: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
};

export function MeetingControls({ isScreenSharing, onToggleScreenShare, isVideoOff, onToggleVideo, isMuted, onToggleMute }: MeetingControlsProps) {
  const [isRecording, setIsRecording] = useState(false);

  const controlButtons = [
    {
      label: isMuted ? 'Unmute' : 'Mute',
      icon: isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />,
      onClick: onToggleMute,
    },
    {
      label: isVideoOff ? 'Start Video' : 'Stop Video',
      icon: isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />,
      onClick: onToggleVideo,
    },
    {
      label: isScreenSharing ? 'Stop Sharing' : 'Share Screen',
      icon: <ScreenShare className="h-6 w-6" />,
      onClick: onToggleScreenShare,
      active: isScreenSharing,
    },
    {
      label: isRecording ? 'Stop Recording' : 'Record',
      icon: <CircleDot className="h-6 w-6" />,
      onClick: () => setIsRecording(!isRecording),
      active: isRecording,
      isRecordingButton: true,
    },
  ];

  return (
    <footer className="w-full bg-transparent p-4 shrink-0">
      <div className="mx-auto flex w-full max-w-fit items-center justify-center gap-2 sm:gap-3 rounded-full border bg-card/90 p-2 shadow-lg backdrop-blur-sm">
        <TooltipProvider delayDuration={0}>
          {controlButtons.map((btn, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={btn.onClick}
                  className={cn(
                    'h-12 w-12 rounded-full text-muted-foreground hover:bg-accent/20 hover:text-foreground',
                    btn.active && btn.isRecordingButton && 'text-destructive animate-pulse',
                    btn.active && !btn.isRecordingButton && 'bg-primary/10 text-primary'
                  )}
                >
                  {btn.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{btn.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          <InvitationButton />

          <Separator orientation="vertical" className="mx-2 h-8" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full">
                <PhoneOff className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Leave Meeting</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </footer>
  );
}
