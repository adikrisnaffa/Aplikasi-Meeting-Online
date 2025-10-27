'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { MeetingControls } from '@/components/meeting-controls';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Mic, MicOff, VideoIcon, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ParticipantVideo } from '@/components/participant-video';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isSpeaking: boolean;
  joinedAt: any;
}

export default function MeetingRoom({
  meetingId: meetingIdProp,
}: {
  meetingId: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const { toast } = useToast();
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const screenShareStream = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [hasLeftMeeting, setHasLeftMeeting] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const meetingName = searchParams.get('name') || 'Meeting';
  const firestore = useFirestore();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const localParticipantIdRef = useRef<string>(`user-${Date.now()}`);

  const localParticipant = participants.find(
    (p) => p.id === localParticipantIdRef.current
  );
  const remoteParticipants = participants.filter(
    (p) => p.id !== localParticipantIdRef.current
  );

  useEffect(() => {
    setMeetingId(meetingIdProp);
  }, [meetingIdProp]);

  // Firestore: Setup participant listeners and join meeting
  useEffect(() => {
    if (!firestore || !meetingId) return;

    const participantRef = doc(
      firestore,
      'meetings',
      meetingId,
      'participants',
      localParticipantIdRef.current
    );

    const joinMeeting = async () => {
      const randomAvatar =
        PlaceHolderImages[
          Math.floor(Math.random() * PlaceHolderImages.length)
        ].id;
      await setDoc(participantRef, {
        id: localParticipantIdRef.current,
        name: 'Guest', // You can enhance this later
        avatar: randomAvatar,
        isMuted: isMuted,
        isSpeaking: false,
        joinedAt: serverTimestamp(),
      });
    };

    joinMeeting();

    const participantsCol = collection(
      firestore,
      'meetings',
      meetingId,
      'participants'
    );
    const unsubscribeParticipants = onSnapshot(participantsCol, (snapshot) => {
      const newParticipants: Participant[] = [];
      snapshot.forEach((doc) => {
        newParticipants.push(doc.data() as Participant);
      });
      // Sort by joinedAt to keep the order stable
      newParticipants.sort(
        (a, b) => (a.joinedAt?.seconds || 0) - (b.joinedAt?.seconds || 0)
      );
      setParticipants(newParticipants);
    });

    const handleBeforeUnload = () => {
        deleteDoc(participantRef);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      unsubscribeParticipants();
      deleteDoc(participantRef);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [firestore, meetingId, isMuted]);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setHasCameraPermission(true);
        setMediaStream(stream);
        stream.getAudioTracks().forEach((track) => (track.enabled = !isMuted));

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description:
            'Please enable camera and microphone permissions in your browser settings.',
        });
      }
    };

    getPermissions();

    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [toast, isMuted]);

  const updateParticipantMuteStatus = async (muted: boolean) => {
     if (!firestore || !meetingId) return;
     const participantRef = doc(
      firestore,
      'meetings',
      meetingId,
      'participants',
      localParticipantIdRef.current
    );
    await setDoc(participantRef, { isMuted: muted }, { merge: true });
  }

  const toggleVideo = () => {
    if (mediaStream) {
      const newVideoState = !isVideoOff;
      mediaStream.getVideoTracks().forEach((track) => {
        track.enabled = !newVideoState;
      });
      setIsVideoOff(newVideoState);
       if (videoRef.current && !isScreenSharing) {
        // We show the stream only if video is on.
        videoRef.current.srcObject = !newVideoState ? mediaStream : null;
      }
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !newMutedState;
      });
      setIsMuted(newMutedState);
      updateParticipantMuteStatus(newMutedState);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        screenShareStream.current = stream;
        setIsScreenSharing(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        stream.getVideoTracks()[0].onended = () => stopScreenShare();
      } catch (error) {
        console.error('Error sharing screen:', error);
        setIsScreenSharing(false);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    screenShareStream.current?.getTracks().forEach((track) => track.stop());
    screenShareStream.current = null;
    setIsScreenSharing(false);
    if (videoRef.current) {
      videoRef.current.srcObject =
        mediaStream && !isVideoOff ? mediaStream : null;
    }
  };

  const toggleRecording = () =>
    isRecording ? stopRecording() : startRecording();

  const startRecording = () => {
    const stream = isScreenSharing
      ? screenShareStream.current
      : mediaStream;
    if (!stream) {
      toast({
        variant: 'destructive',
        title: 'Recording Error',
        description: 'No media stream available to record.',
      });
      return;
    }

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recording-${new Date().toISOString()}.webm`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: 'Recording Started',
        description: 'The meeting is now being recorded.',
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        variant: 'destructive',
        title: 'Recording Error',
        description:
          'Could not start recording. Your browser may not support it.',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: 'Recording Stopped',
        description: 'Your recording will be downloaded shortly.',
      });
    }
  };

  const leaveMeeting = () => {
    if (firestore && meetingId) {
      const participantRef = doc(firestore, 'meetings', meetingId, 'participants', localParticipantIdRef.current);
      deleteDoc(participantRef);
    }
    mediaStream?.getTracks().forEach((track) => track.stop());
    screenShareStream.current?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    if (isRecording) stopRecording();
    setHasLeftMeeting(true);
    toast({ title: 'You have left the meeting.' });
  };

  if (hasLeftMeeting) {
    return (
      <div className="flex h-screen w-full flex-col bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
          <Logo />
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <div className="rounded-full bg-primary/20 p-4">
              <VideoIcon className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            You have left the meeting
          </h1>
          <p className="max-w-md text-muted-foreground">
            You can close this window, rejoin the meeting or go back to home.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => window.location.reload()}>
              Rejoin Meeting
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
        <Logo />
        <div className="text-sm text-muted-foreground text-right">
          <div className="font-medium text-foreground">{meetingName}</div>
          {meetingId && <p>Meeting ID: {meetingId}</p>}
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {localParticipant && (
            <Card
              className={cn(
                'relative aspect-video overflow-hidden rounded-xl shadow-lg'
              )}
            >
              <div className="flex h-full w-full items-center justify-center bg-muted/50">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                />
                {(isVideoOff || isScreenSharing) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Avatar className="h-24 w-24 text-4xl lg:h-32 lg:w-32">
                      <AvatarImage
                        src={
                          PlaceHolderImages.find(
                            (p) => p.id === localParticipant.avatar
                          )?.imageUrl
                        }
                        alt={localParticipant.name}
                      />
                      <AvatarFallback>
                        {localParticipant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
              {!hasCameraPermission && !isScreenSharing && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                      Please allow camera access to use this feature.
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
           {remoteParticipants.map((participant) => {
              const avatar = PlaceHolderImages.find(p => p.id === participant.avatar);
              return (
                <ParticipantVideo
                  key={participant.id}
                  name={participant.name}
                  isMuted={participant.isMuted}
                  isSpeaking={participant.isSpeaking}
                  avatarUrl={avatar?.imageUrl || ''}
                  imageHint={avatar?.imageHint || 'person'}
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
        onLeaveMeeting={leaveMeeting}
      />
    </div>
  );
}

    