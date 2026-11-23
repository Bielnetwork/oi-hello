import { useNavigate } from "@tanstack/react-router";
import { ExperiencePage } from "./pages/ExperiencePage";

export function ExperienceRoute() {
  const navigate = useNavigate();

  return (
    <div id="root">
      <ExperiencePage onOffer={() => void navigate({ to: "/oferta" })} />
    </div>
  );
}
