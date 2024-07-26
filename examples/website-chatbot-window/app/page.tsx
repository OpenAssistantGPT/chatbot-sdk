'use client';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <iframe
        src="/window"
        style={{
          overflow: 'hidden',
          height: '80vh',
          width: '480px',
          bottom: '-30px',
          border: '2px solid #e2e8f0',
          borderRadius: '0.375rem',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
        allow="clipboard-read; clipboard-write"
      ></iframe>
    </div>
  );
}
