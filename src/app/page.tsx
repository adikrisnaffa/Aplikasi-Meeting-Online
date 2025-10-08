'use client';

import { useState, useEffect, useRef } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MeetingControls } from '@/components/meeting-controls';
import { ParticipantVideo } from '@/components/participant-video';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Mic, MicOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const participants = [
  { id: 1, name: 'You', avatar: 'user1', isMuted: true, isSpeaking: false, isYou: true },
  { id: 2, name: 'Alice', avatar: 'user2', isMuted: false, isSpeaking: true },
  { id: 3, name: 'Bob', avatar: 'user3', isMuted: true, isSpeaking: false },
  { id: 4, name: 'Charlie', avatar: 'user4', isMuted: false, isSpeaking: false },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const { toast } = useToast();
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const screenShareStream = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        setMediaStream(stream);

        // Initially mute audio
        stream.getAudioTracks().forEach(track => track.enabled = false);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
      }
    };

    getPermissions();

    return () => {
      mediaStream?.getTracks().forEach(track => track.stop());
    }
  }, [toast]);

  const toggleVideo = () => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
      if (videoRef.current && !isScreenSharing) {
        if (isVideoOff) {
          videoRef.current.srcObject = mediaStream;
        } else {
          videoRef.current.srcObject = null;
        }
      }
    }
  };

  const toggleMute = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenShareStream.current = stream;
        setIsScreenSharing(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        stream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } catch (error) {
        console.error("Error sharing screen:", error);
        setIsScreenSharing(false);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    screenShareStream.current?.getTracks().forEach(track => track.stop());
    screenShareStream.current = null;
    setIsScreenSharing(false);
    if (videoRef.current) {
      if (mediaStream && !isVideoOff) {
        videoRef.current.srcObject = mediaStream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    const stream = isScreenSharing ? screenShareStream.current : mediaStream;
    if (!stream) {
      toast({
        variant: "destructive",
        title: "Recording Error",
        description: "No media stream available to record.",
      });
      return;
    }

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recording-${new Date().toISOString()}.webm`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "The meeting is now being recorded.",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        variant: "destructive",
        title: "Recording Error",
        description: "Could not start recording. Your browser may not support it.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Your recording will be downloaded shortly.",
      });
    }
  };

  const localParticipant = participants.find(p => p.isYou);

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
          {localParticipant && (
            <Card
            className={cn(
              'relative aspect-video overflow-hidden rounded-xl shadow-lg transition-all duration-300 ring-0'
            )}
            >
              <div className="flex h-full w-full items-center justify-center bg-muted/50">
                <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted />
                 {(isVideoOff || (isScreenSharing && !screenShareStream.current)) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Avatar className="h-24 w-24 text-4xl lg:h-32 lg:w-32">
                            <AvatarImage src={PlaceHolderImages.find(p => p.id === localParticipant.avatar)?.imageUrl} alt={localParticipant.name} />
                            <AvatarFallback>{localParticipant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                 )}
              </div>
              {hasCameraPermission === false && !isScreenSharing && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                      Please allow camera access to use this feature. You may need to grant permissions in your browser settings.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
               <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3">
                <span className="text-sm font-medium text-primary-foreground drop-shadow-md">
                  {localParticipant.name} (You)
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
          )}

          {participants
            .filter(p => !p.isYou)
            .map((participant) => {
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
      <MeetingControls 
        isScreenSharing={isScreenSharing}
        onToggleScreenShare={toggleScreenShare}
        isVideoOff={isVideoOff}
        onToggleVideo={toggleVideo}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
      />
    </div>
  );
}
