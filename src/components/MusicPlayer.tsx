import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_SEQ_01",
    artist: "MECHA_CORE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "0xCORRUPT",
    artist: "NOISE_GEN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "NULL_PTR",
    artist: "SYS_FAULT",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  return (
    <div className="flex flex-col gap-6 w-full font-sans text-xl text-[#0ff]">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="border-4 border-[#f0f] bg-black p-4 relative">
        <div className="absolute top-0 right-0 bg-[#f0f] text-black px-2 font-black animate-pulse uppercase">
          ACTV
        </div>
        <h3 className="text-4xl font-mono uppercase mb-2 animate-glitch break-all">{currentTrack.title}</h3>
        <p className="text-2xl uppercase text-[#f0f] font-bold">SRC: {currentTrack.artist}</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between font-mono font-bold uppercase text-2xl">
          <span>OUT_BUFFER</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-12 border-4 border-[#0ff] bg-black relative">
          <div 
            className="h-full bg-[#f0f] transition-all duration-75 text-black font-mono font-black text-2xl flex items-center overflow-hidden whitespace-nowrap"
            style={{ width: `${progress}%` }}
          >
            <span className="pl-2 tracking-widest">{"\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e\u003e"}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 h-16">
        <button 
          onClick={prevTrack} 
          className="flex-1 border-4 border-[#0ff] bg-black hover:bg-[#0ff] hover:text-black text-3xl font-mono font-black transition-none flex items-center justify-center pt-1"
        >
          {'<<'}
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex-[2] border-4 bg-black text-3xl font-mono font-black transition-none flex items-center justify-center pt-1 uppercase ${isPlaying ? 'border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black' : 'border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black animate-glitch'}`}
        >
          {isPlaying ? 'SUSPEND' : 'EXECUTE'}
        </button>

        <button 
          onClick={nextTrack} 
          className="flex-1 border-4 border-[#0ff] bg-black hover:bg-[#0ff] hover:text-black text-3xl font-mono font-black transition-none flex items-center justify-center pt-1"
        >
          {'>>'}
        </button>
      </div>

      <div className="mt-4 border-4 border-dashed border-[#0ff] p-4 font-mono text-xl uppercase flex flex-col gap-2">
        {TRACKS.map((t, i) => (
          <div 
            key={t.id} 
            className={`p-2 border-2 ${i === currentTrackIndex ? 'bg-[#0ff] text-black font-black border-transparent' : 'text-[#f0f] border-[#f0f] bg-black hover:bg-[#f0f] hover:text-black cursor-pointer'}`}
            onClick={() => {
              setCurrentTrackIndex(i);
              setIsPlaying(true);
            }}
          >
            [{i}] {t.title}
          </div>
        ))}
      </div>
    </div>
  );
}
