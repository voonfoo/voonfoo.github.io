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

// Hidden for now - brewing...
const _projects: Project[] = [
  {
    title: "Robot Simulator",
    description:
      "A physics-based simulation environment for testing robot control algorithms and motion planning strategies.",
    tags: ["Python", "PyBullet", "ROS2"],
    github: "https://github.com/voonfoo/robot-simulator",
  },
  {
    title: "Path Planner",
    description:
      "Implementation of various motion planning algorithms including RRT*, A*, and potential fields for mobile robots.",
    tags: ["C++", "ROS", "Visualization"],
    github: "https://github.com/voonfoo/path-planner",
  },
  {
    title: "SLAM Pipeline",
    description:
      "A modular SLAM system combining visual odometry with loop closure detection for autonomous navigation.",
    tags: ["Python", "OpenCV", "NumPy"],
    github: "https://github.com/voonfoo/slam-pipeline",
  },
];

const openSourceProjects: OpenSourceProject[] = [
  {
    name: "ROS2",
    description: "Robot Operating System 2 - Next generation robotics middleware",
    url: "https://github.com/ros2/ros2",
    role: "Contributor",
  },
  {
    name: "MoveIt",
    description: "Motion planning framework for robotic manipulation",
    url: "https://github.com/moveit/moveit2",
    role: "Contributor",
  },
  {
    name: "Gazebo",
    description: "Open-source 3D robotics simulator",
    url: "https://github.com/gazebosim/gz-sim",
    role: "Contributor",
  },
];

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

        {/* Open Source Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-pixel text-foreground mb-8 text-center">
            <span className="text-primary">&gt;</span> OPEN SOURCE
          </h2>

          {/* Open source grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {openSourceProjects.map((project) => (
              <OpenSourceCard key={project.name} project={project} />
            ))}
          </div>

          {/* GitHub link */}
          <div className="text-center mt-8">
            <a
              href="https://github.com/voonfoo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Github className="w-4 h-4" />
              <span>View all contributions</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
