"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Github, Linkedin, Mail } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 relative">
      {/* Theme toggle in corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className="text-center space-y-6 max-w-3xl">
        {/* Pixel art decoration */}
        <div className="text-4xl mb-4 cursor-pointer group select-none transition-transform hover:scale-110">
          <span className="text-primary">&gt;</span>
          <span className="text-muted-foreground">
            <span className="group-hover:hidden">_</span>
            <span className="hidden group-hover:inline">o</span>
          </span>
          <span className="text-primary">&lt;</span>
        </div>

        {/* Name */}
        <h1 className="text-2xl md:text-4xl font-pixel text-foreground">VOON FOO</h1>

        {/* Title */}
        <p className="text-lg md:text-xl font-pixel text-primary">SOFTWARE ENGINEER</p>

        {/* Tagline with blinking cursor */}
        <p className="text-sm md:text-base text-muted-foreground cursor-blink">
          Building robots bit by bit
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center pt-8">
          <a
            href="#projects"
            className="pixel-border px-6 py-3 bg-primary text-primary-foreground font-pixel text-xs hover:bg-primary/90 retro-press"
          >
            VIEW PROJECTS
          </a>
          <a
            href="#contact"
            className="pixel-border px-6 py-3 bg-background text-foreground font-pixel text-xs hover:bg-accent retro-press"
          >
            CONTACT ME
          </a>
        </div>

        {/* Social links */}
        <div className="flex gap-4 justify-center pt-4">
          <a
            href="https://github.com/voonfoo"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-border p-2 hover:bg-accent retro-press group"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 transition-colors group-hover:text-[#6e5494]" />
          </a>
          <a
            href="https://linkedin.com/in/voonfoo"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-border p-2 hover:bg-accent retro-press group"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 transition-colors group-hover:text-[#0a66c2]" />
          </a>
          <a
            href="mailto:contact@voonfoo.com"
            className="pixel-border p-2 hover:bg-accent retro-press group"
            aria-label="Email"
          >
            <Mail className="w-5 h-5 transition-colors group-hover:text-[#ea4335]" />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground text-xs font-pixel animate-bounce">
        SCROLL
      </div>
    </section>
  );
}
