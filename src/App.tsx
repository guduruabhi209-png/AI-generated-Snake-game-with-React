import React from 'react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';

export default function App() {
  return (
    <div className="h-screen bg-black text-[#0ff] font-sans flex flex-col overflow-hidden relative">
      {/* Static Noise Overlay */}
      <div className="absolute inset-0 noise-bg z-[100]" />
      
      {/* Tearing effect overlay */}
      <div className="absolute inset-0 bg-[#f0f] mix-blend-difference pointer-events-none opacity-20 animate-tear z-[99]" />

      {/* RAW Header */}
      <header className="h-24 border-b-4 border-[#f0f] flex items-center justify-between px-4 lg:px-8 bg-black z-50 relative shrink-0">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl font-mono text-[#0ff] animate-glitch tracking-widest uppercase">
            SYS_KERN_SNAKE.EXE
          </h1>
          <span className="text-lg md:text-2xl text-[#f0f] mt-1 uppercase">
            [WARNING: DISPLAY_DRIVER_CORRUPTED]
          </span>
        </div>
        
        <div className="hidden lg:flex gap-8 items-center bg-[#0ff] text-black px-4 py-2 border-4 border-[#f0f]">
          <div className="flex flex-col items-end">
            <span className="text-lg uppercase font-bold">NODE_STATE</span>
            <span className="text-2xl font-mono font-black animate-pulse">DEGRADED</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg uppercase font-bold">MEM_ADDR</span>
            <span className="text-2xl font-mono font-black tracking-widest bg-black text-[#0ff] px-2">0x00F9C</span>
          </div>
        </div>
      </header>

      {/* Matrix Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative border-x-4 border-[#0ff] mx-2 my-2 lg:mx-4">
        
        {/* Audio Component (Left side) */}
        <aside className="w-full lg:w-96 border-b-4 lg:border-b-0 lg:border-r-4 border-[#f0f] bg-black p-4 flex flex-col gap-4 relative z-50 shrink-0 overflow-y-auto">
          <div className="text-3xl font-mono text-[#f0f] border-b-4 border-[#0ff] pb-2 uppercase animate-glitch tracking-widest bg-black z-10 sticky top-0">
            &gt; AUDIO_BUF_DECODE
          </div>
          <MusicPlayer />
        </aside>

        {/* Game Interface */}
        <section className="flex-1 p-4 flex flex-col items-center justify-center relative bg-[#000] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.2] pointer-events-none" 
               style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, #0ff 4px, #0ff 8px)' }} />
          
          <div className="relative z-10 w-full max-w-2xl bg-black border-8 border-[#0ff] shadow-[12px_12px_0_0_#f0f] p-2">
            <SnakeGame />
          </div>
        </section>
      </main>

      {/* Bottom bar */}
      <footer className="h-12 border-t-8 border-[#0ff] bg-[#f0f] text-black flex items-center justify-between px-4 lg:px-8 z-50 font-mono font-black uppercase text-xl shrink-0">
        <span>&gt; KERNEL_PANIC_IMMInENT</span>
        <span className="animate-pulse tracking-widest">Awaiting_Input...</span>
      </footer>
    </div>
  );
}
