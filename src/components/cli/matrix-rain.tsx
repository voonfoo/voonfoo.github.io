"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>[]{}=+*/#$%&";

export function MatrixRain({
  onDone,
  durationMs = 9000,
}: {
  onDone: () => void;
  durationMs?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    const stop = () => {
      if (stoppedRef.current) return;
      stoppedRef.current = true;
      onDone();
    };
    const timer = window.setTimeout(stop, durationMs);
    window.addEventListener("keydown", stop);

    const canvas = canvasRef.current;
    if (!canvas)
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("keydown", stop);
      };

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = 0;
    const fontSize = 16;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      columns = Math.ceil(canvas.width / (fontSize * devicePixelRatio));
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -100));
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      if (stoppedRef.current) return;
      raf = requestAnimationFrame(draw);
      if (t - last < 50) return;
      last = t;

      ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize * devicePixelRatio}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * fontSize * devicePixelRatio;
        const y = drops[i] * fontSize * devicePixelRatio;
        // bright head
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fillText(char, x, y);
        // phosphor trail
        ctx.fillStyle = "rgba(120, 255, 170, 0.55)";
        ctx.fillText(
          GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          x,
          y - fontSize * devicePixelRatio
        );
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      stoppedRef.current = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("resize", resize);
    };
  }, [onDone, durationMs]);

  return (
    <div className="fixed inset-0 z-40 animate-in fade-in duration-300">
      <canvas ref={canvasRef} className="h-full w-full" />
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-sm tracking-[0.3em] text-white/80">
        WAKE UP... PRESS ANY KEY
      </p>
    </div>
  );
}
