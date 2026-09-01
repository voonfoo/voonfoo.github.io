import type { Metadata } from "next";
import { CliExperience } from "@/components/cli/experience";

export const metadata: Metadata = {
  title: "commits · voon foo",
  description: "GitHub contribution calendar heatmap.",
};

export default function CommitsPage() {
  return <CliExperience initialCommand="/commits" />;
}
