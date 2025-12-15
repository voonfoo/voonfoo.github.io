import { ExternalLink, Github, Coffee, Star, GitFork } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
}

interface OpenSourceProject {
  name: string;
  description: string;
  url: string;
  stars?: string;
  role: string;
}

function OpenSourceCard({ project }: { project: OpenSourceProject }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="pixel-border p-4 bg-card text-card-foreground hover:bg-accent/10 transition-colors block retro-press"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-pixel text-xs text-foreground">{project.name}</h3>
          <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary">{project.role}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <GitFork className="w-3 h-3" />
          <span>Open Source</span>
        </div>
      </div>
    </a>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-16">
        {/* Projects Section - Brewing */}
        <div>
          <h2 className="text-xl md:text-2xl font-pixel text-foreground mb-8 text-center">
            <span className="text-primary">&gt;</span> PROJECTS
          </h2>

          {/* Brewing animation */}
          <div className="pixel-border p-8 bg-card text-card-foreground">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Coffee className="w-12 h-12 text-primary animate-bounce" />
              <p className="font-pixel text-sm text-muted-foreground">
                BREWING<span className="animate-pulse">...</span>
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Personal projects are cooking. Check back soon!
              </p>
            </div>
          </div>
        </div>

        {/* Open Source Section - Hidden for now */}
      </div>
    </section>
  );
}
