import React from 'react';

import { cn } from '@/lib/utils';
import { ExternalLink } from '@/components/external-link';

export function FooterText({
  className,
  link,
  name,
  ...props
}: React.ComponentProps<'p'> & { link: string; name: string }) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className,
      )}
      {...props}
    >
      Powered by <ExternalLink href={link}>{name}</ExternalLink>
    </p>
  );
}
