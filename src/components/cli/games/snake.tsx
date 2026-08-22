"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ============================================================
   SNAKE.EXE — terminal-styled, inline in the transcript.
   Arrow/WASD to steer · SPACE pauses · ESC pauses + frees keys.
   ============================================================ */

const COLS = 22;
const ROWS = 16;
const CELL = 15;
const TICK_START = 140;
const TICK_MIN = 78;

type Pt = { x: number; y: number };

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<"idle" | "playing" | "paused" | "over">("idle");

  const dirRef = useRef<Pt>({ x: 1, y: 0 });
  const queuedDirRef = useRef<Pt | null>(null);
  const snakeRef = useRef<Pt[]>([]);
  const foodRef = useRef<Pt>({ x: 0, y: 0 });
  const scoreRef = useRef(0);
  const tickRef = useRef(TICK_START);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const Wpx = COLS * CELL;
    const Hpx = ROWS * CELL;

    // board
    ctx.fillStyle = "#0c0e0c";
    ctx.fillRect(0, 0, Wpx, Hpx);
    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.lineWidth = 1;
    for (let x = 1; x < COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL + 0.5, 0);
      ctx.lineTo(x * CELL + 0.5, Hpx);
      ctx.stroke();
    }
    for (let y = 1; y < ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL + 0.5);
      ctx.lineTo(Wpx, y * CELL + 0.5);
      ctx.stroke();
    }

    // food — the single point of colour
    const f = foodRef.current;
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(f.x * CELL + 3, f.y * CELL + 3, CELL - 6, CELL - 6);

    // snake — bright head fading toward the tail
    const snake = snakeRef.current;
    snake.forEach((s, i) => {
      const t = i / Math.max(1, snake.length - 1);
      const shade = i === 0 ? 237 : Math.round(160 - t * 70);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(s.x * CELL + 1.5, s.y * CELL + 1.5, CELL - 3, CELL - 3);
    });
  }, []);

  const spawnFood = useCallback(() => {
    let p: Pt;
    do {
      p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snakeRef.current.some((s) => s.x === p.x && s.y === p.y));
    foodRef.current = p;
  }, []);

  const reset = useCallback(() => {
    const midY = Math.floor(ROWS / 2);
    snakeRef.current = [
      { x: 5, y: midY },
      { x: 4, y: midY },
      { x: 3, y: midY },
    ];
    dirRef.current = { x: 1, y: 0 };
    queuedDirRef.current = null;
    scoreRef.current = 0;
    tickRef.current = TICK_START;
    setScore(0);
    spawnFood();
    draw();
  }, [draw, spawnFood]);

  const step = useCallback(() => {
    if (queuedDirRef.current) {
      const q = queuedDirRef.current;
      const d = dirRef.current;
      if (q.x !== -d.x || q.y !== -d.y) dirRef.current = q; // no instant reversal
      queuedDirRef.current = null;
    }
    const d = dirRef.current;
    const head = snakeRef.current[0];
    const next: Pt = { x: head.x + d.x, y: head.y + d.y };

    const hitWall = next.x < 0 || next.y < 0 || next.x >= COLS || next.y >= ROWS;
    const hitSelf = snakeRef.current.some((s) => s.x === next.x && s.y === next.y);
    if (hitWall || hitSelf) {
      setBest((b) => Math.max(b, scoreRef.current));
      setPhase("over");
      return;
    }

    snakeRef.current.unshift(next);
    if (next.x === foodRef.current.x && next.y === foodRef.current.y) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      tickRef.current = Math.max(TICK_MIN, tickRef.current - 2);
      spawnFood();
    } else {
      snakeRef.current.pop();
    }
    draw();
  }, [draw, spawnFood]);

  /* main loop — restarts whenever tick speed changes */
  useEffect(() => {
    if (phase !== "playing") return;
    const iv = setInterval(step, tickRef.current);
    return () => clearInterval(iv);
  }, [phase, step, score]);

  /* keyboard — only captured while playing */
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Pt> = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
        D: { x: 1, y: 0 },
      };
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        setPhase("paused");
        return;
      }
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        queuedDirRef.current = dir;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const begin = useCallback(() => {
    if (phase === "idle" || phase === "over") reset();
    setPhase("playing");
  }, [phase, reset]);

  /* initial board preview — refs + paint only, no state churn */
  useEffect(() => {
    const midY = Math.floor(ROWS / 2);
    snakeRef.current = [
      { x: 5, y: midY },
      { x: 4, y: midY },
      { x: 3, y: midY },
    ];
    dirRef.current = { x: 1, y: 0 };
    queuedDirRef.current = null;
    tickRef.current = TICK_START;
    spawnFood();
    draw();
  }, [draw, spawnFood]);

  return (
    <figure className="w-fit font-mono">
      <figcaption className="mb-1 flex items-baseline gap-4 text-xs text-dim">
        <span>
          score <span className="tabular-nums text-text">{score}</span>
        </span>
        <span>
          best <span className="tabular-nums text-text">{best}</span>
        </span>
        <span className="hidden sm:inline">arrows/wasd · space pause · esc pause</span>
      </figcaption>

      <div className="relative border border-line" style={{ width: COLS * CELL }}>
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="block" />

        {phase !== "playing" && (
          <button
            type="button"
            onClick={begin}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/75 text-center"
          >
            {phase === "idle" && (
              <>
                <p className="text-base text-text">SNAKE</p>
                <p className="text-xs text-dim">click to play</p>
              </>
            )}
            {phase === "paused" && (
              <>
                <p className="text-base text-text">PAUSED</p>
                <p className="text-xs text-dim">click to resume · esc stays safe</p>
              </>
            )}
            {phase === "over" && (
              <>
                <p className="text-lg text-[#ff5555]">GAME OVER</p>
                <p className="text-xs text-dim">score {score} · click to retry</p>
              </>
            )}
          </button>
        )}
      </div>
    </figure>
  );
}
