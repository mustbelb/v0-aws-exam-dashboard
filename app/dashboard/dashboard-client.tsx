"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Layers3, Check, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { ProgressOverview } from "@/components/progress-overview";
import { ServiceGrid } from "@/components/service-grid";
import { certifications, type CertificationType } from "@/lib/services";
interface ProgressData {
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  streak: number;
  serviceProgress: {
    service: string;
    attempted: number;
    correct: number;
    accuracy: number;
    lastPracticed: string;
  }[];
}
export function DashboardClient({
  user,
  isActive,
  subscriptionStatus,
  preview = false,
}: {
  user: { id: string; email: string; name: string };
  isActive: boolean;
  subscriptionStatus: string;
  preview?: boolean;
}) {
  const [selectedCert, setSelectedCert] =
    useState<CertificationType>("SAA-C03");
  const [progress, setProgress] = useState<ProgressData | null>(null),
    [loading, setLoading] = useState(!preview),
    [error, setError] = useState(false);
  useEffect(() => {
    if (preview) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetch(`/api/progress?certification=${selectedCert}`)
      .then(async (r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setProgress(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedCert, preview]);
  const map = new Map(
    progress?.serviceProgress.map((p) => [p.service, p.accuracy]) || [],
  );
  return (
    <div>
      <Header user={user} preview={preview} />
      <main className="workspace">
        <div className="flex flex-wrap justify-between gap-6 items-end mb-9">
          <div>
            <p className="eyebrow mb-3">
              Your workspace / {preview ? "Design preview" : "Overview"}
            </p>
            <h1 className="editorial-title text-4xl sm:text-5xl">
              A little closer. Every day.
            </h1>
            <p className="text-muted-foreground mt-4">
              Welcome back, {user.name.split(" ")[0]}. Make room for your next
              breakthrough.
            </p>
          </div>
          <span className="text-xs border rounded-full px-3 py-2 bg-card text-muted-foreground">
            {preview
              ? "Preview · sample account"
              : isActive
                ? "Pro membership"
                : "Practice workspace"}
          </span>
        </div>
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 mb-7">
          <section className="rounded-2xl bg-[#183b3a] text-white p-7 sm:p-9 relative overflow-hidden">
            <p className="text-xs uppercase tracking-[.18em] text-[#a9d2c8] mb-5">
              Your certification path
            </p>
            <div
              role="group"
              aria-label="Certification"
              className="flex flex-wrap gap-2 mb-7"
            >
              {certifications.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCert(c.id)}
                  aria-pressed={selectedCert === c.id}
                  className={`rounded-full text-sm px-4 py-2 border transition-colors ${selectedCert === c.id ? "bg-[#dbefc8] text-[#183b3a] border-transparent" : "border-white/25 text-white/85 hover:bg-white/10"}`}
                >
                  {selectedCert === c.id && (
                    <Check size={13} className="inline mr-2" />
                  )}
                  {c.name}
                </button>
              ))}
            </div>
            <h2 className="text-3xl sm:text-4xl font-medium mb-3">
              {certifications.find((c) => c.id === selectedCert)?.name}{" "}
              Associate
            </h2>
            <p className="text-sm text-[#c3d8d5] max-w-lg leading-relaxed">
              {certifications.find((c) => c.id === selectedCert)?.description}.
            </p>
            <div className="flex justify-between items-center mt-8 gap-3">
              <span className="text-xs tracking-wider text-[#a9d2c8]">
                AWS CERTIFIED · {selectedCert}
              </span>
              <a
                href="#practice"
                className="inline-flex items-center gap-2 bg-white text-[#183b3a] rounded-lg px-4 py-2.5 text-sm font-semibold"
              >
                Choose a service <ArrowRight size={16} />
              </a>
            </div>
          </section>
          <aside className="study-panel p-7 flex flex-col justify-between">
            <div>
              <Layers3
                className="text-primary mb-5"
                size={25}
                strokeWidth={1.5}
              />
              <p className="eyebrow mb-3">A fresh perspective</p>
              <h2 className="text-2xl font-medium mb-3">
                Connect the concepts.
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Mix services in a category to practice choosing the right tool
                for the problem.
              </p>
            </div>
            <Link
              href={
                preview
                  ? "/design-preview?view=practice"
                  : `/practice/random/compute?cert=${selectedCert}`
              }
              className="mt-6 text-sm font-semibold text-primary inline-flex gap-2 items-center"
            >
              Try mixed practice <ArrowUpRight size={16} />
            </Link>
          </aside>
        </div>
        {error ? (
          <div role="alert" className="study-panel p-6 mb-8 text-destructive">
            Your progress couldn’t load. Refresh the page to try again.
          </div>
        ) : (
          <ProgressOverview
            readinessPercentage={progress?.overallAccuracy || 0}
            totalQuestions={progress?.totalQuestions || 0}
            currentStreak={progress?.streak || 0}
            loading={loading}
          />
        )}
        <section id="practice" className="mt-12 scroll-mt-6">
          <div className="flex justify-between items-end gap-4 mb-7">
            <div>
              <p className="eyebrow mb-2">Build your understanding</p>
              <h2 className="text-3xl font-medium">What will you work on?</h2>
            </div>
            <span className="hidden sm:block text-sm text-muted-foreground">
              Choose a service. Find your focus.
            </span>
          </div>
          <ServiceGrid
            certification={selectedCert}
            progressMap={map}
            preview={preview}
          />
        </section>
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        AWS Exam Prep · Independent learning, one concept at a time.
      </footer>
    </div>
  );
}
