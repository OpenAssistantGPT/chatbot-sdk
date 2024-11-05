import { useEffect, useRef, RefObject, useState } from 'react';

export function useScrollToBottom<T extends HTMLElement>(
  messages: any,
): [
  RefObject<T>,
  RefObject<T>,
  boolean, // true or false is at buttom
  Function,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user is scrolling near the bottom of the window
      const windowScrollY = window.scrollY + window.innerHeight; // Current scroll position + height of the window
      const documentHeight = document.documentElement.scrollHeight; // Total document height

      // Determine if the user is at the bottom (within a threshold of 100 pixels)
      const isNoButtom = windowScrollY <= documentHeight - 100; // Adjust threshold as needed
      setShouldScroll(!isNoButtom);
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const end = endRef.current;

    // Scroll to the end only if the user is at the bottom of the window
    if (end && shouldScroll) {
      document.documentElement.scrollTop =
        document.getElementById('end')!.offsetTop;
      //end.scrollIntoView({ behavior: 'instant' });
    }
  }, [messages, shouldScroll]);

  function scrollToBottom() {
    const end = endRef.current;

    if (end) {
      //end.scrollIntoView({ behavior: 'smooth' });
      document.documentElement.scrollTop =
        document.getElementById('end')!.offsetTop;
    }
  }

  return [containerRef, endRef, shouldScroll, scrollToBottom];
}
