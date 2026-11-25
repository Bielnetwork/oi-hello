import { useLocation, useNavigate } from "@tanstack/react-router";
import { ExperiencePage } from "./pages/ExperiencePage";

export function ExperienceRoute() {
  const navigate = useNavigate();
  const search = useLocation({ select: (location) => location.searchStr });

  return (
    <div id="root">
      <ExperiencePage experienceHref={`/experiencia${search}`} onOffer={() => void navigate({ to: "/oferta", search: true })} />
    </div>
  );
}
