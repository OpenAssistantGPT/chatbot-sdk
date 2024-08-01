import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CardHeader } from '@/components/ui/card';
import {
  LucideDownload,
  LucideMenu,
  LucideRefreshCcw,
  LucideX,
} from 'lucide-react';
import { ChatbotConfig } from '@/src';

export function ChatHeader({
  chatbot,
  withExitX,
  downloadTranscript,
  closeChat,
}: {
  chatbot: ChatbotConfig;
  withExitX: boolean;
  downloadTranscript: () => void;
  closeChat: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set the initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <CardHeader
      style={{ background: chatbot.chatHeaderBackgroundColor }}
      className="sticky z-30 top-0 border-b p-4"
    >
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl font-bold flex items-center h-10 gap-2">
          <div style={{ color: chatbot.chatHeaderTextColor }}>
            {chatbot.chatTitle}
          </div>
        </h2>
        <div className="flex flex-row items-center space-x-4">
          {isMobile ? (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="nothing" size="icon">
                    <LucideMenu
                      style={{ color: chatbot.chatHeaderTextColor }}
                      className="h-5 w-5"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => window.location.reload()}>
                      <LucideRefreshCcw className="mr-2 h-4 w-4" />
                      <span className="ml-4">New Chat</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={downloadTranscript}>
                      <LucideDownload className="mr-2 h-4 w-4" />
                      <span className="ml-4">Download Transcript</span>
                    </DropdownMenuItem>
                    {withExitX && (
                      <DropdownMenuItem onSelect={closeChat}>
                        <LucideX className="mr-2 h-4 w-4" />
                        <span className="ml-4">Exit Chat</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex flex-row items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="nothing"
                    className="cursor-pointer"
                    size="icon"
                    onClick={() => window.location.reload()}
                  >
                    <LucideRefreshCcw
                      style={{ color: chatbot.chatHeaderTextColor }}
                      className="h-4 w-4"
                    />
                    <span className="sr-only">New Chat</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Chat</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="nothing"
                    className="cursor-pointer"
                    size="icon"
                    onClick={downloadTranscript}
                  >
                    <LucideDownload
                      style={{ color: chatbot.chatHeaderTextColor }}
                      className="h-4 w-4"
                    />
                    <span className="sr-only">Download Transcript</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download Transcript</TooltipContent>
              </Tooltip>
              {withExitX && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={closeChat}
                      variant="nothing"
                      size="icon"
                      className="cursor-pointer"
                    >
                      <LucideX
                        style={{ color: chatbot.chatHeaderTextColor }}
                        className="h-5 w-5"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exit Chat</TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </div>
    </CardHeader>
  );
}
