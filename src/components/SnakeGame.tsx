import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Point { x: number; y: number; }

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prev) => {
      const head = prev[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Map collision checking
      if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prev;
      }

      const newSnake = [newHead, ...prev];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, highScore]);

  useEffect(() => {
    const loop = (time: number) => {
      if (time - lastUpdateRef.current > 120) { // Fast for glitchy feel
        update();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [update]);

  return (
    <div className="flex flex-col items-center p-2 lg:p-4 bg-[#000] relative font-mono text-[#0ff] w-full">
      
      <div className="flex justify-between w-full mb-4 px-2 border-b-8 border-[#f0f] pb-4 z-20 uppercase font-black tracking-widest flex-col sm:flex-row gap-4">
        <div className="flex flex-col border-l-8 border-[#0ff] pl-4">
          <span className="text-xl lg:text-2xl text-[#f0f]">ALLOCATED[MEM]</span>
          <span className="text-4xl lg:text-5xl animate-glitch mt-2">
            0x{score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-start sm:items-end border-l-8 sm:border-l-0 sm:border-r-8 border-[#0ff] pl-4 sm:pr-4">
          <span className="text-xl lg:text-2xl text-[#0ff]">PEAK[MEM]</span>
          <span className="text-4xl lg:text-5xl text-[#f0f] mt-2">
            0x{highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative border-8 border-[#0ff] bg-black p-1 w-full max-w-[600px] aspect-square flex-shrink-0">
        
        <div 
          className="grid gap-[2px] w-full h-full bg-[#f0f]" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const snakeIndex = snake.findIndex((s) => s.x === x && s.y === y);
            const isHead = snakeIndex === 0;
            const isFood = food.x === x && food.y === y;

            let bgClass = "bg-[#000]";
            if (isHead) bgClass = "bg-[#ffffff]";
            else if (isSnake) bgClass = "bg-[#0ff] opacity-80";
            else if (isFood) bgClass = "bg-[#f0f] animate-pulse";

            return (
              <div key={i} className={`w-full h-full ${bgClass}`} />
            );
          })}
        </div>

        {/* Overlays */}
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 text-center p-4 border-8 border-[#f0f]">
            {gameOver ? (
              <>
                <h2 className="text-4xl md:text-5xl font-mono text-[#f0f] mb-4 uppercase animate-glitch bg-black p-4 border-4 border-[#0ff]">
                  FATAL ERR 0xDEAD
                </h2>
                <p className="text-[#0ff] mb-8 font-mono text-xl animate-pulse tracking-widest break-all">SEGMENTATION_FAULT_AT_SECT_{score}</p>
                <button
                  onClick={resetGame}
                  className="bg-[#f0f] text-black border-8 border-[#0ff] px-8 py-4 text-2xl lg:text-4xl font-black hover:bg-[#0ff] hover:text-black transition-none uppercase"
                >
                  [ FORCE_REBOOT ]
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-mono text-[#0ff] mb-4 uppercase animate-glitch tracking-widest">
                  SYS_READY
                </h2>
                <p className="text-[#f0f] mb-12 font-mono text-xl tracking-widest">AWAITING_INPUT...</p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="bg-[#0ff] text-black border-8 border-[#f0f] px-8 py-6 text-2xl lg:text-4xl font-black hover:bg-[#f0f] transition-none uppercase animate-pulse"
                >
                  [ INIT_SEQUENCE ]
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
