"use client";
import Link from "next/link";
import {
  Cpu,
  Database,
  Network,
  ShieldCheck,
  Layers3,
  ArrowUpRight,
  Shuffle,
} from "lucide-react";
import {
  getServicesByCategory,
  getCategoriesForCertification,
  type CertificationType,
} from "@/lib/services";
export function ServiceGrid({
  certification,
  progressMap,
  preview = false,
}: {
  certification: CertificationType;
  progressMap?: Map<string, number>;
  preview?: boolean;
}) {
  const grouped = getServicesByCategory(certification);
  return (
    <div className="space-y-9">
      {getCategoriesForCertification(certification).map((category, index) => {
        const services = grouped[category.name] || [];
        if (!services.length) return null;
        const Icon =
          category.id === "compute"
            ? Cpu
            : category.id === "database" || category.id === "storage"
              ? Database
              : category.id.includes("security")
                ? ShieldCheck
                : category.id.includes("network")
                  ? Network
                  : Layers3;
        return (
          <section key={category.id} id={category.id}>
            <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex gap-3 items-center">
                <span className="text-xs font-mono text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {category.name}
                <span className="text-xs font-normal text-muted-foreground tracking-normal">
                  {services.length} services
                </span>
              </h3>
              <Link
                href={
                  preview
                    ? "/design-preview?view=practice"
                    : `/practice/random/${category.id}?cert=${certification}`
                }
                className="text-sm text-primary font-medium flex items-center gap-2"
              >
                <Shuffle size={15} />
                Mix this category <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {services.map((service) => {
                const accuracy = progressMap?.get(service.id);
                return (
                  <Link
                    key={service.id}
                    href={
                      preview
                        ? "/design-preview?view=practice"
                        : `/practice/${service.id}?cert=${certification}`
                    }
                    className="service-tile group"
                  >
                    <div className="w-11 h-11 bg-secondary/70 rounded-xl grid place-items-center text-primary shrink-0">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm">{service.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {accuracy === undefined
                          ? "Start practicing"
                          : `${accuracy}% accuracy`}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={17}
                      className="text-muted-foreground group-hover:text-primary shrink-0"
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
