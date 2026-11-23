import { createFileRoute } from "@tanstack/react-router";
import { OfferPage } from "../rota60/pages/OfferPage";

export const Route = createFileRoute("/oferta")({
  ssr: false,
  component: () => <div id="root"><OfferPage /></div>,
});
