const skills = {
  robotics: [
    "Simulation",
    "Motion Planning",
    "Inverse Kinematics",
    "Sampling Algorithms",
    "Optimization",
  ],
  languages: ["Python", "C#", "C++"],
  tools: ["Git", "Docker", "CMake", "GitHub Actions", "Terraform"],
  frameworks: ["Unity3D", "Next.js", "React"],
};

function SkillBadge({ skill }: { skill: string }) {
  return (
    <span className="pixel-border px-3 py-1.5 text-xs bg-secondary text-secondary-foreground hover:bg-accent retro-press inline-block">
      {skill}
    </span>
  );
}

function SkillCategory({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-pixel text-primary uppercase">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((skill) => (
          <SkillBadge key={skill} skill={skill} />
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="py-20 px-4 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        {/* Section title */}
        <h2 className="text-xl md:text-2xl font-pixel text-foreground mb-8 text-center">
          <span className="text-primary">&gt;</span> SKILLS
        </h2>

        {/* Skills grid */}
        <div className="pixel-border p-6 md:p-8 bg-card text-card-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkillCategory title="Robotics" items={skills.robotics} />
            <SkillCategory title="Languages" items={skills.languages} />
            <SkillCategory title="Tools" items={skills.tools} />
            <SkillCategory title="Frameworks" items={skills.frameworks} />
          </div>
        </div>
      </div>
    </section>
  );
}
