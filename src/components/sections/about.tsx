export function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section title */}
        <h2 className="text-xl md:text-2xl font-pixel text-foreground mb-8 text-center">
          <span className="text-primary">&gt;</span> ABOUT ME
        </h2>

        {/* Content card */}
        <div className="pixel-border p-6 md:p-8 bg-card text-card-foreground">
          <div className="space-y-4 text-sm md:text-base leading-relaxed">
            <p>
              Hi! I&apos;m a Software Engineer passionate about robotics, with a focus on{" "}
              <span className="text-primary font-semibold">simulation</span> and{" "}
              <span className="text-primary font-semibold">motion planning</span>.
            </p>
            <p>
              I build systems that help robots understand their environment and move intelligently
              through it. From physics simulations to path planning algorithms, I enjoy solving
              complex problems at the intersection of software and physical systems.
            </p>
            <p>When I&apos;m not coding, I am usually rock climbing or playing the piano!</p>
          </div>

          {/* Decorative pixel line */}
          <div className="retro-separator mt-6 pt-6">
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span className="text-primary">&gt;</span>
              <span>STATUS: READY TO SLEEP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
