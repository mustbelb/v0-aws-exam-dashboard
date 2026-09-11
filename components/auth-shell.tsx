import Link from "next/link";
import { Layers3, ArrowUpRight } from "lucide-react";
export function AuthShell({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <main className="auth-layout">
      <aside className="auth-story">
        <Link
          href="/"
          className="inline-flex gap-3 items-center text-lg font-semibold"
        >
          <Layers3 size={28} />
          AWS Exam Prep
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-[#a9d2c8] mb-7">
            Learn with intention
          </p>
          <h2 className="editorial-title text-6xl max-w-lg">
            Build knowledge.
            <br />
            <span className="text-[#d6edbf]">Then confidence.</span>
          </h2>
          <p className="text-[#c3d8d5] max-w-md mt-8 leading-relaxed">
            A focused space to practice AWS concepts, understand your mistakes,
            and keep moving forward.
          </p>
        </div>
        <div className="border-t border-white/20 pt-6 flex justify-between text-sm text-[#c3d8d5]">
          <span>Solutions Architect & Developer</span>
          <ArrowUpRight size={18} />
        </div>
      </aside>
      <section className="auth-form">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="text-sm text-muted-foreground inline-block mb-10"
          >
            ← Back to AWS Exam Prep
          </Link>
          <p className="eyebrow mb-3">Your next chapter</p>
          <h1 className="editorial-title text-4xl mb-4">{title}</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {description}
          </p>
          {children}
        </div>
      </section>
    </main>
  );
}
