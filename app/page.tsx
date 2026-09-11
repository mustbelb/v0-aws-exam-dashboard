import Link from "next/link";
import {
  Layers3,
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Target,
  Workflow,
} from "lucide-react";
export default function HomePage() {
  return (
    <div>
      <header className="max-w-[1280px] mx-auto p-6 sm:px-10 flex justify-between items-center border-b">
        <Link className="flex items-center gap-3 font-semibold" href="/">
          <span className="brand-mark">
            <Layers3 size={22} />
          </span>
          AWS Exam Prep
        </Link>
        <Link className="text-sm font-medium" href="/auth/login">
          Sign in <ArrowUpRight size={15} className="inline ml-2" />
        </Link>
      </header>
      <main>
        <section className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16 sm:py-24 grid lg:grid-cols-[1.2fr_1fr] gap-14 items-center">
          <div>
            <p className="eyebrow mb-7">For your next AWS certification</p>
            <h1 className="editorial-title text-5xl sm:text-7xl lg:text-[80px]">
              Know the cloud.
              <br />
              <span className="text-primary">Find your footing.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mt-7">
              Turn complex services into concepts that click. Focused practice,
              thoughtful explanations, and a clearer view of your progress.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex gap-5 items-center mt-9 rounded-lg bg-primary text-white px-6 py-4 text-sm font-semibold"
            >
              Create your study space <ArrowRight size={18} />
            </Link>
            <p className="text-xs text-muted-foreground mt-5">
              Solutions Architect Associate · Developer Associate
            </p>
          </div>
          <div className="bg-[#183b3a] text-white rounded-[24px] p-7 sm:p-10">
            <p className="text-xs tracking-[.2em] text-[#b9d6cf] uppercase mb-10">
              From question to understanding
            </p>
            <div className="space-y-0">
              {[
                {
                  n: "01",
                  title: "Choose your focus",
                  copy: "Start with a service, or connect the dots with mixed practice.",
                  icon: Target,
                },
                {
                  n: "02",
                  title: "Think it through",
                  copy: "Work through a scenario and make your choice.",
                  icon: Workflow,
                },
                {
                  n: "03",
                  title: "Make it click",
                  copy: "Understand the answer with explanations and interactive lessons.",
                  icon: BookOpen,
                },
              ].map((s, i) => (
                <div
                  key={s.n}
                  className={`flex gap-5 py-6 ${i < 2 ? "border-b border-white/15" : ""}`}
                >
                  <span className="text-[#9ec5bb] font-mono text-sm pt-1">
                    {s.n}
                  </span>
                  <div>
                    <h2 className="text-xl tracking-tight mb-2">{s.title}</h2>
                    <p className="text-sm leading-relaxed text-[#c3d8d5]">
                      {s.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-7 border-t border-white/20 text-[#d6edbf] text-sm">
              Small sessions. Lasting understanding.
            </div>
          </div>
        </section>
        <section className="border-y bg-card">
          <div className="max-w-[1280px] mx-auto p-8 sm:p-12 flex flex-wrap gap-6 justify-between items-center">
            <p className="editorial-title text-3xl">Your pace. Your path.</p>
            <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
              Practice one service at a time, revisit the concepts that
              challenge you, and build confidence through understanding.
            </p>
          </div>
        </section>
      </main>
      <footer className="max-w-[1280px] mx-auto px-6 py-8 text-xs text-muted-foreground">
        AWS Exam Prep · Independent exam preparation. Not affiliated with Amazon
        Web Services.
      </footer>
    </div>
  );
}
