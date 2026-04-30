import { useState, useEffect, useCallback, useRef } from 'react';
import { Play } from 'lucide-react';

const GRID_SIZE = 15; // smaller grid for chunkier retro look
const INITIAL_SPEED = 180;
const SPEED_INCREMENT = 3;
const MIN_SPEED = 80;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 5, y: 5 },
  { x: 5, y: 6 },
  { x: 5, y: 7 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

// Helper to generate food not on snake
const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 10, y: 10 });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true); // start paused
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);

  const directionRef = useRef(direction);

  useEffect(() => {
    const saved = localStorage.getItem('glitchSnakeHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  const gameOver = useCallback(() => {
    setIsGameOver(true);
    setIsPaused(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('glitchSnakeHighScore', score.toString());
    }
  }, [score, highScore]);

  // Main game loop
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          gameOver();
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          gameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [isPaused, isGameOver, food, gameOver, speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling and button triggering for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (isGameOver && e.key === ' ') {
        startGame();
        return;
      }
      
      if (!isGameOver && e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || isGameOver) return;

      const currentDir = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
      setDirection(directionRef.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isGameOver]);

  // Create grid cells
  const gridCells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);
    
    const isHead = snake[0].x === x && snake[0].y === y;
    const isBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    return (
      <div
        key={i}
        className={`w-full h-full border-[0.5px] border-white/5 ${
          isHead 
            ? 'bg-cyan-400 border-2 border-white' 
            : isBody 
            ? 'bg-cyan-600 border-2 border-cyan-400/50' 
            : isFood 
            ? 'bg-fuchsia-500 animate-pulse border-2 border-white' 
            : 'bg-black'
        }`}
      />
    );
  });

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto font-mono">
      {/* Score Header */}
      <div className="flex items-center justify-between w-full mb-6 border-4 border-white bg-black p-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-fuchsia-500 uppercase">SCORE_REG</span>
          <span className="text-2xl font-bold text-white leading-none mt-1">{score.toString().padStart(4, '0')}</span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-cyan-400 uppercase">HI_SCORE_REG</span>
          <span className="text-xl font-bold text-gray-400 leading-none mt-1">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative border-8 border-cyan-400 bg-black p-1 w-full max-w-[500px] aspect-square shadow-[8px_8px_0_theme(colors.fuchsia.500)] mt-2">
        <div 
          className="w-full h-full relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gap: '0px',
          }}
        >
          {gridCells}
          
          {/* Overlays */}
          {(isPaused || isGameOver) && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 font-sans">
              <div className="flex flex-col items-center gap-6 p-6 border-4 border-fuchsia-500 bg-black text-center max-w-[80%] shadow-[8px_8px_0_theme(colors.cyan.400)]">
                {isGameOver ? (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-black text-red-500 uppercase tracking-tighter glitch" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                    <div className="flex flex-col items-center border-y-2 border-white/20 py-2 w-full">
                      <span className="text-white text-[10px] font-mono mb-1">SCORE: {score.toString().padStart(4, '0')}</span>
                      {score >= highScore && score > 0 && <span className="bg-cyan-400 text-black px-2 py-1 text-[10px] font-bold uppercase mt-1">NEW RECORD</span>}
                    </div>
                    <button 
                      onClick={startGame}
                      className="flex items-center gap-2 px-6 py-3 border-4 border-white text-white hover:bg-white hover:text-black font-bold text-xs uppercase cursor-pointer"
                    >
                      [ REBOOT_SYS ]
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-black text-cyan-400 uppercase tracking-tighter shadow-md">SNAKE.EXE</h2>
                    <p className="text-fuchsia-500 text-[10px] font-mono leading-tight bg-white/10 p-2 border-l-4 border-fuchsia-500">
                      INPUT: [W,A,S,D] OR [ARROWS]<br/>
                      PAUSE: [SPACE]
                    </p>
                    <button 
                      onClick={startGame}
                      className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-fuchsia-500 text-black font-bold uppercase text-xs border-2 border-transparent hover:border-white"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {">"} EXECUTE
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
