import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'CYBERPUNK DRIFT',
    artist: 'NEURAL_WAVE.AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'NEON PULSE',
    artist: 'SYNTH_MIND.AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'SYNTHWAVE ECHO',
    artist: 'ALGO_BEATS.AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error('Audio play failed:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(prev => !prev);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full flex flex-col gap-6 pt-2">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
      />
      
      {/* Now Playing Info */}
      <div className="flex border-4 border-fuchsia-500 bg-black/80">
        <div className={`w-20 h-20 bg-fuchsia-500 flex items-center justify-center shrink-0 border-r-4 border-fuchsia-500 ${isPlaying ? 'animate-[spin_2s_steps(4)_infinite]' : ''}`}>
          <Disc3 className="w-10 h-10 text-black" strokeWidth={1.5} />
        </div>
        
        <div className="flex flex-col overflow-hidden p-3 w-full relative">
          {isPlaying && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-black animate-pulse" />
          )}
          <span className="text-[10px] text-cyan-400 font-mono mb-1">{">"} {">"} NOW_PLAYING</span>
          <h3 className="text-white font-sans text-xs truncate leading-tight uppercase glitch" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-fuchsia-400 text-[10px] font-mono mt-auto uppercase">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-4 border-cyan-400 p-2 bg-black">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-white hover:text-cyan-400 hover:bg-white/10 p-2 border-2 border-transparent hover:border-cyan-400 transition-none"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            className="text-white hover:bg-fuchsia-500 hover:text-black p-2 border-2 border-transparent hover:border-fuchsia-500 transition-none"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-white text-black hover:bg-cyan-400 border-4 border-white hover:border-cyan-400 flex items-center justify-center transition-none shadow-[4px_4px_0_theme(colors.fuchsia.500)] hover:shadow-none translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-white hover:bg-fuchsia-500 hover:text-black p-2 border-2 border-transparent hover:border-fuchsia-500 transition-none"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>
      
      {/* Playlist Indicator */}
      <div className="flex justify-between gap-1 font-mono text-[8px] text-white uppercase">
        {TRACKS.map((_, idx) => (
          <div 
            key={idx} 
            className={`flex-1 border-2 py-1 text-center ${idx === currentTrackIndex ? 'bg-cyan-400 border-cyan-400 text-black' : 'border-white/30 text-white/50'}`}
          >
            TRK_0{idx + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
