'use client';
import { useRouter } from 'next/navigation';

export function useScrollOnRedirect() {
  const router = useRouter();

  const pushAndScroll = (url: string) => {
    router.push(url);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return { pushAndScroll };
}
