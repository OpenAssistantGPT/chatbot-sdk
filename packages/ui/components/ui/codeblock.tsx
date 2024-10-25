import { FC, memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkCold } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useCopyToClipboardNoTimeout } from '@/hooks/use-copy-to-clipboard';

interface Props {
  language: string;
  value: string;
}

interface languageMap {
  [key: string]: string | undefined;
}

const programmingLanguages: languageMap = {
  javascript: '.js',
  python: '.py',
  java: '.java',
  c: '.c',
  cpp: '.cpp',
  'c++': '.cpp',
  'c#': '.cs',
  ruby: '.rb',
  php: '.php',
  swift: '.swift',
  'objective-c': '.m',
  kotlin: '.kt',
  typescript: '.ts',
  go: '.go',
  perl: '.pl',
  rust: '.rs',
  scala: '.scala',
  haskell: '.hs',
  lua: '.lua',
  shell: '.sh',
  sql: '.sql',
  html: '.html',
  css: '.css',
  // add more file extensions here, make sure the key is same as language prop in CodeBlock.tsx component
};

function generateRandomString(length: number, lowercase = false) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXY3456789'; // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return lowercase ? result.toLowerCase() : result;
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const { copyToClipboard } = useCopyToClipboardNoTimeout();

  const downloadAsFile = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const fileExtension = programmingLanguages[language] || '.file';
    const suggestedFileName = `file-${generateRandomString(
      3,
      true,
    )}${fileExtension}`;
    const fileName = window.prompt('Enter file name' || '', suggestedFileName);

    if (!fileName) {
      // User pressed cancel on prompt.
      return;
    }

    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onCopy = () => {
    copyToClipboard(value);
  };

  return (
    <div className="relative w-full font-sans codeblock bg-white text-muted-foreground border">
      <div className="flex items-center justify-between w-full px-6 py-2 pr-4 bg-muted text-zinc-100">
        <span className="text-xs lowercase text-muted-foreground">
          {language}
        </span>
        <div className="flex items-center space-x-1 text-muted-foreground">
          <Button
            variant="ghost"
            className="hover:bg-white focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
            onClick={downloadAsFile}
            size="icon"
          >
            <Icons.download />
            <span className="sr-only">Download</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-xs hover:bg-white focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
            onClick={onCopy}
          >
            <Icons.copy />
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={coldarkCold}
        PreTag="div"
        showLineNumbers
        customStyle={{
          margin: 0,
          width: '100%',
          background: 'transparent',
          padding: '1.5rem 1rem',
        }}
        lineNumberStyle={{
          userSelect: 'none',
        }}
        codeTagProps={{
          style: {
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)',
          },
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
});
CodeBlock.displayName = 'CodeBlock';

export { CodeBlock };
