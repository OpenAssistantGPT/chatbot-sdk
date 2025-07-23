declare module '@react-pdf/renderer' {
  import * as React from 'react';

  export interface DocumentProps {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    children?: React.ReactNode;
  }

  export interface PageProps {
    size?: string | { width: number; height: number };
    orientation?: 'portrait' | 'landscape';
    style?: any;
    wrap?: boolean;
    children?: React.ReactNode;
  }

  export interface ViewProps {
    style?: any;
    wrap?: boolean;
    break?: boolean;
    children?: React.ReactNode;
  }

  export interface TextProps {
    style?: any;
    wrap?: boolean;
    break?: boolean;
    render?: (props: { pageNumber: number; totalPages: number }) => string;
    fixed?: boolean;
    children?: React.ReactNode;
  }

  export const Document: React.FC<React.PropsWithChildren<DocumentProps>>;
  export const Page: React.FC<React.PropsWithChildren<PageProps>>;
  export const View: React.FC<React.PropsWithChildren<ViewProps>>;
  export const Text: React.FC<React.PropsWithChildren<TextProps>>;

  export const StyleSheet: {
    create: (styles: any) => any;
  };

  export const pdf: (element: React.ReactElement) => {
    toBlob: () => Promise<Blob>;
    toBuffer: () => Promise<Buffer>;
  };
} 