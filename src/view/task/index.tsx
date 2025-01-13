import { useState } from 'react';
import { Container } from '@/components/box';

export default function Task() {
  const [iframeLoading, setIframeLoading] = useState(true);

  return (
    <div className="h-[calc(100vh-3rem)]">
      <Container className="h-full overflow-hidden relative">
        {iframeLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[--primary-border-color] overflow-hidden">
            <div 
              className="h-full bg-[--primary]"
              style={{
                animation: 'progress 1.5s ease-in-out infinite',
                backgroundImage: 'linear-gradient(to right, var(--primary), var(--primary))',
                width: '100%'
              }}
            />
          </div>
        )}
        <iframe 
          src="https://mini-doge.com/memes" 
          className="w-full h-full border-0"
          onLoad={() => setIframeLoading(false)}
        />
      </Container>
    </div>
  );
}
