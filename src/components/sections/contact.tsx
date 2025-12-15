import { Mail, Github, Linkedin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-20 px-4 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        {/* Section title */}
        <h2 className="text-xl md:text-2xl font-pixel text-foreground mb-8 text-center">
          <span className="text-primary">&gt;</span> CONTACT
        </h2>

        {/* Contact card */}
        <div className="pixel-border p-6 md:p-8 bg-card text-card-foreground text-center">
          <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed">
            Interested in working together or just want to chat about robotics?
            <br />
            Feel free to reach out!
          </p>

          {/* Contact links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:contact@voonfoo.com"
              className="pixel-border px-6 py-3 bg-primary text-primary-foreground font-pixel text-xs hover:bg-primary/90 retro-press flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              SAY HELLO
            </a>
          </div>

          {/* Social links */}
          <div className="retro-separator mt-8 pt-8">
            <p className="text-xs text-muted-foreground mb-4">Or find me on these platforms:</p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://github.com/voonfoo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground retro-press"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/voonfoo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground retro-press"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
