import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const handleError = (e: any) => {
      console.error('Erro no player:', e);
      setError('Erro ao carregar o stream. Verificando conexão...');
      
      // Tenta reconectar após 5 segundos
      setTimeout(() => {
        if (hls) {
          hls.loadSource(src);
          setError(null);
        }
      }, 5000);
    };

    try {
      if (Hls.isSupported()) {
        hls = new Hls({
          debug: true,
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 30,
          maxBufferSize: 0,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 3,
          levelLoadingTimeOut: 10000,
          levelLoadingMaxRetry: 3
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Erro de rede, tentando reconectar...');
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Erro de mídia, tentando recuperar...');
                hls?.recoverMediaError();
                break;
              default:
                console.log('Erro fatal, tentando reconectar...');
                hls?.destroy();
                initPlayer();
                break;
            }
          }
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setError(null);
          video.play().catch(console.error);
        });

        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback para Safari
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(console.error);
        });
      }
    } catch (e) {
      console.error('Erro ao inicializar o player:', e);
      handleError(e);
    }

    const initPlayer = () => {
      if (hls) {
        hls.destroy();
      }
      
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      }
    };

    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('error', handleError);
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        controls
        autoPlay
        playsInline
        muted // Adicionado muted para autoplay funcionar em mais navegadores
      />
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500/10 text-red-200 p-4 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};