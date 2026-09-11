import { LessonsPreview } from "./lessons-client"
import { notFound } from "next/navigation";
import { DashboardClient } from "@/app/dashboard/dashboard-client";
import { PracticePreview } from "./preview-client";
export const dynamic = "force-dynamic";
export default function DesignPreview({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  if (process.env.DESIGN_PREVIEW !== "true") notFound();
  if (searchParams.view === "lessons") return <LessonsPreview />
  return searchParams.view === "practice" ? (
    <PracticePreview />
  ) : (
    <DashboardClient
      user={{ id: "preview", email: "preview@example.com", name: "Learner" }}
      isActive={false}
      subscriptionStatus="none"
      preview
    />
  );
}
