import { createFileRoute } from "@tanstack/react-router";
import { ExperienceRoute } from "../rota60/ExperienceRoute";

export const Route = createFileRoute("/")({
  component: ExperienceRoute,
});
