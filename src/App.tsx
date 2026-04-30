import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden selection:bg-fuchsia-500 selection:text-black">
      {/* Glitch Overlay Elements */}
      <div className="static-noise"></div>
      
      {/* Background CRT and Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_2px,transparent_2px),linear-gradient(90deg,rgba(255,0,255,0.1)_2px,transparent_2px)] bg-[size:40px_40px]" />
        <div className="absolute top-[20%] left-[10%] w-[200px] h-[5px] bg-cyan-400 opacity-40 screen-tear" />
        <div className="absolute bottom-[30%] right-[20%] w-[150px] h-[8px] bg-fuchsia-500 opacity-40 screen-tear" style={{ animationDelay: '1.2s' }} />
        {/* Shadow Overlay */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full p-6 border-b-8 border-cyan-400 bg-black flex flex-col sm:flex-row items-start sm:items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-black border-4 border-fuchsia-500 flex items-center justify-center pixel-corners shrink-0">
              <Terminal className="w-8 h-8 text-cyan-400" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold uppercase text-cyan-400 glitch tracking-tighter" data-text="SYS.TERMINAL //">
                SYS.TERMINAL //
              </h1>
              <p className="text-[10px] text-fuchsia-500 font-mono tracking-widest uppercase mt-2">
                EXECUTABLE: //0x0A99 -- CORRUPT
              </p>
            </div>
          </div>
          <div className="mt-6 sm:mt-0 flex flex-col items-start sm:items-end rotate-[-2deg] opacity-80">
             <span className="text-fuchsia-500 font-mono text-[12px] bg-white text-black px-2 py-1 uppercase shadow-[4px_4px_0_theme(colors.fuchsia.500)]">ERR_CODE: REDACTED</span>
             <span className="text-cyan-400 font-mono text-[12px] tracking-widest mt-2 bg-black px-2 py-1 border-2 border-cyan-400 border-dashed">STATUS: COMPROMISED</span>
          </div>
        </header>

        {/* Main Interface Box */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 flex flex-col lg:flex-row items-stretch justify-center gap-6 mt-6 z-20">
          {/* Game Window */}
          <div className="w-full lg:w-[65%] border-4 border-fuchsia-500 bg-black p-4 relative pixel-corners shadow-[8px_8px_0_theme(colors.cyan.400)]">
             <div className="absolute top-[-16px] left-[10px] bg-fuchsia-500 text-black font-sans text-xs px-3 py-1 uppercase tracking-tighter border-2 border-black">
                EXECUTE // SNAKE.EXE
             </div>
             <SnakeGame />
          </div>

          {/* Side Panel */}
          <div className="w-full lg:w-[35%] flex flex-col gap-8 h-full">
            <div className="border-4 border-cyan-400 bg-black p-4 relative pixel-corners shadow-[8px_8px_0_theme(colors.fuchsia.500)]">
               <div className="absolute top-[-16px] left-[10px] bg-cyan-400 text-black font-sans text-xs px-3 py-1 uppercase tracking-tighter border-2 border-black">
                  AUDIO // STREAM_MATRIX
               </div>
               <MusicPlayer />
            </div>

            <div className="border-4 border-white bg-black p-6 font-mono text-[14px] text-white uppercase flex flex-col gap-3 relative overflow-hidden flex-1 pixel-corners">
               <div className="absolute top-0 right-0 w-8 h-8 bg-red-600 animate-ping opacity-50" />
               <p className="text-cyan-400">{">"} TRACING CONNECTION...</p>
               <p className="text-fuchsia-500">{">"} NODE: NEUROMANCER_7</p>
               <p className="glitch mt-4 text-red-500 font-bold" data-text="> WARNING: DATA CORRUPTION DETECTED">
                  {">"} WARNING: DATA CORRUPTION
               </p>
               <div className="grid grid-cols-4 gap-2 mt-4 text-[10px] opacity-60">
                   <span>0xFA1</span><span>0x00B</span><span>0xCCC</span><span>0xFF0</span>
                   <span className="text-fuchsia-500 animate-pulse">ERR</span><span>0x112</span><span>0xAA9</span><span>0x334</span>
                   <span>0xBB2</span><span className="text-cyan-400">0xSYS</span><span>0x2A4</span><span>0x8DF</span>
               </div>
               
               <div className="mt-auto border-t-4 border-dashed border-white/30 pt-4 flex justify-between items-end">
                  <div className="w-16 h-16 border-4 border-cyan-400 rounded-full border-t-transparent animate-[spin_2s_linear_infinite]" />
                  <span className="text-[10px] text-gray-500">AWAITING_INPUT...</span>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
