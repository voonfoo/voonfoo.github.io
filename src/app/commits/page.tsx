import type { Metadata } from "next";
import { CliExperience } from "@/components/cli/experience";

export const metadata: Metadata = {
  title: "commits · voon foo",
  description: "Live GitHub commit heatmap.",
};

export default function CommitsPage() {
  return <CliExperience initialCommand="/commits" />;
}
