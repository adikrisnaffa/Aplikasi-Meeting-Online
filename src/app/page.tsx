'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, ChevronLeft, ChevronRight, CircleHelp, Menu, Plus, Settings, Video, Grip, Phone, MessageSquareWarning } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function LobbyPage() {
  const [meetingCode, setMeetingCode] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const generateMeetingId = () => {
    const part1 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const part2 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const part3 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${part1}-${part2}-${part3}`;
  };

  const handleCreateMeeting = () => {
    const meetingId = generateMeetingId();
    router.push(`/meeting/${meetingId}?name=New%20Meeting`);
  };

  const handleJoinMeeting = () => {
    if (!meetingCode.trim()) {
      toast({
        variant: "destructive",
        title: "Meeting code is required",
        description: "Please enter a code or link to join a meeting.",
      });
      return;
    }
    // Assuming the user enters a valid meeting ID
    const meetingId = meetingCode.trim();
    router.push(`/meeting/${meetingId}`);
  };
  
  const carouselItems = [
    {
      image: "https://www.gstatic.com/meet/user_edu_safety_light_e04a2bbb449524ef7e49ea36d5f25b65.svg",
      title: "Rapat Anda aman",
      description: "Tidak ada yang dapat bergabung ke rapat kecuali diundang atau diizinkan oleh penyelenggara",
    },
    {
      image: "https://www.gstatic.com/meet/user_edu_get_a_link_light_903getalINK.svg",
      title: "Dapatkan link yang bisa dibagikan",
      description: "Klik Rapat baru untuk mendapatkan link yang dapat Anda kirim ke orang-orang yang ingin Anda ajak rapat",
    },
    {
      image: "https://www.gstatic.com/meet/user_edu_scheduling_light_b352efa017e4f8f1ffda43e847820322.svg",
      title: "Rencanakan lebih dahulu",
      description: "Klik Rapat baru untuk menjadwalkan rapat di Google Kalender dan mengirimkan undangan kepada peserta",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? carouselItems.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === carouselItems.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };


  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Image src="https://www.gstatic.com/meet/google_meet_horizontal_wordmark_2020q4_1x_icon_124_40_2373e79660dabbf194273d2a70cd1c46.png" alt="Google Meet" width={124} height={40} />
            </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>12.12 &bull; Rab, 8 Okt</span>
            <CircleHelp className="h-5 w-5" />
            <MessageSquareWarning className="h-5 w-5" />
            <Settings className="h-5 w-5" />
            <Grip className="h-5 w-5" />
            <Avatar className="h-8 w-8">
                <AvatarFallback>A</AvatarFallback>
            </Avatar>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
            <nav className="flex flex-col gap-2">
                <Button variant="secondary" className="justify-start gap-3">
                    <Video className="h-5 w-5" />
                    Rapat
                </Button>
                <Button variant="ghost" className="justify-start gap-3">
                    <Phone className="h-5 w-5" />
                    Panggilan telepon
                </Button>
            </nav>
        </aside>
        <main className="flex flex-1 items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-4xl font-light tracking-tight">Rapat dan panggilan video untuk semua orang</h1>
                        <p className="mt-4 text-muted-foreground">Terhubung, berkolaborasi, dan merayakan dari mana saja dengan Google Meet</p>
                        <div className="mt-8 flex items-center gap-4">
                            <Button onClick={handleCreateMeeting}>
                                <Plus className="mr-2 h-5 w-5" />
                                Rapat baru
                            </Button>
                            <div className="relative">
                                <Input 
                                    placeholder="Masukkan kode atau link" 
                                    className="pl-10" 
                                    value={meetingCode}
                                    onChange={(e) => setMeetingCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleJoinMeeting()}
                                />
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            </div>
                             <Button variant="ghost" onClick={handleJoinMeeting} disabled={!meetingCode.trim()}>Gabung</Button>
                        </div>
                        <div className="mt-8 border-b"></div>
                    </div>
                    <div className="relative h-64 w-full">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Image src={carouselItems[currentIndex].image} alt="Feature illustration" width={300} height={200} className="mx-auto" />
                        <h3 className="mt-4 text-xl font-medium">{carouselItems[currentIndex].title}</h3>
                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{carouselItems[currentIndex].description}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full" onClick={prevSlide}>
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full" onClick={nextSlide}>
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}
