export const PROFILE = {
  name: "VOON FOO",
  handle: "voonfoo",
  host: "voonfoo.github.io",
  role: "Robotics Software Engineer",
  tagline: "building robots bit by bit",
  email: "contact@voonfoo.com",
  github: "https://github.com/voonfoo",
  linkedin: "https://linkedin.com/in/voonfoo",
  location: "Singapore",
} as const;

export const ABOUT = [
  "Hi! I'm a Software Engineer passionate about robotics, with a focus on simulation and automation.",
  "I build systems that help robots understand their environment and act intelligently within it — from physics simulations to the tooling that keeps everything moving.",
  "When I'm not coding, I am usually rock climbing or playing the piano!",
] as const;

export const OPEN_SOURCE = [
  {
    name: "oh-my-pi",
    tagline: "AI coding agent for the terminal — the IDE wired in.",
    url: "https://github.com/can1357/oh-my-pi",
    author: "can1357",
    role: "Contributor",
    stars: "26.4k",
    description:
      "Hash-anchored edits that land first try, LSP + DAP wired into every write, parallel subagents, and ~80k lines of Rust doing the work other agents shell out for. Built on Mario Zechner's Pi.",
  },
] as const;

export const SKILLS: Array<{ group: string; items: string[] }> = [
  { group: "robotics", items: ["Simulation", "Automation", "Systems Integration", "Optimization"] },
  { group: "languages", items: ["Python", "C#", "C++"] },
  { group: "tools", items: ["Git", "Docker", "CMake", "GitHub Actions", "Terraform"] },
  { group: "frameworks", items: ["Unity3D", "Next.js", "React"] },
];

export const ASCII_BANNER = String.raw`
██╗   ██╗ ██████╗  ██████╗ ███╗   ██╗    ███████╗ ██████╗  ██████╗
██║   ██║██╔═══██╗██╔═══██╗████╗  ██║    ██╔════╝██╔═══██╗██╔═══██╗
██║   ██║██║   ██║██║   ██║██╔██╗ ██║    █████╗  ██║   ██║██║   ██║
██║   ██║██║   ██║██║   ██║██║╚██╗██║    ██╔══╝  ██║   ██║██║   ██║
╚██████╔╝╚██████╔╝╚██████╔╝██║ ╚████║██╗ ██║     ╚██████╔╝╚██████╔╝
 ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝ ╚═╝      ╚═════╝  ╚═════╝`;

export const NEOFETCH_ART = [
  "   ┌─────────┐   ",
  "   │  ◉   ◉  │   ",
  "   │    ‿    │   ",
  "   └────┬────┘   ",
  " ┌──────┴──────┐ ",
  " │  [ROBOT-01] │ ",
  " └─┬─────────┬─┘ ",
  "   │         │   ",
  "  ▄█▄       ▄█▄  ",
];
