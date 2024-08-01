import { LucideLoader2, LucideX } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useState } from 'react';

export function SupportInquiry() {
  const [open, setOpen] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');

  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [hideInquiry, setHideInquiry] = useState(false);

  function handleInquirySubmit(e: any) {
    e.preventDefault();
    setInquiryLoading(true);

    console.log('User email:', userEmail);

    setInquiryLoading(false);
  }

  if (hideInquiry) {
    return null;
  }

  return (
    <div className={`relative`}>
      <button
        onClick={() => {
          setHideInquiry(true);
        }}
        className="bg-zinc-100 shadow hover:bg-zinc-200 border rounded absolute top-0 right-0 -mt-1 -mr-1"
      >
        <LucideX className="h-4 w-4" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-white" variant="outline">
            Contact our support
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleInquirySubmit}>
            <DialogHeader>
              <DialogTitle>Contact our support team</DialogTitle>
              <DialogDescription>
                Give us a shout and we&apos;ll get back to you as soon as
                possible.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 w-full">
              <div className="gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  onChange={e => setUserEmail(e.target.value)}
                  className="bg-white"
                  id="email"
                  pattern=".+@.+\..+"
                  type="email"
                />
              </div>
              <div className="gap-4">
                <Label htmlFor="username" className="text-right">
                  Message
                </Label>
                <Textarea
                  onChange={e => setUserMessage(e.target.value)}
                  className="min-h-[100px]"
                  id="message"
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={inquiryLoading}>
                Send
                {inquiryLoading && (
                  <LucideLoader2 className="ml-2 mr-2 h-5 w-5 animate-spin" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
