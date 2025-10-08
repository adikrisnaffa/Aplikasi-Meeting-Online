import Image from 'next/image';

export function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
       <Image src="https://www.gstatic.com/meet/google_meet_horizontal_wordmark_2020q4_1x_icon_124_40_2373e79660dabbf194273d2a70cd1c46.png" alt="Google Meet" width={124} height={40} />
    </a>
  );
}
