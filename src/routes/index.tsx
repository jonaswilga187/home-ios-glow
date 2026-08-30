import { createFileRoute } from "@tanstack/react-router";
import { Cpu, HardDrive, MemoryStick, Server, Wifi } from "lucide-react";
import { BrandIcon } from "../components/BrandIcon";
import {
  hostSummary,
  infraNodes,
  internalApps,
  managementServices,
  statusLabel,
  type HomelabService,
  type InfraNode,
  type ServiceStatus,
} from "../lib/homelab-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Homelab OS – Infrastruktur-Übersicht" },
      {
        name: "description",
        content:
          "Live-Status aller Homelab-Dienste: Interne Apps, Verwaltung und VMs mit Uptime, Latenz und Auslastung.",
      },
      { property: "og:title", content: "Homelab OS – Infrastruktur-Übersicht" },
      {
        property: "og:description",
        content:
          "Live-Status aller Homelab-Dienste: Interne Apps, Verwaltung und VMs mit Uptime, Latenz und Auslastung.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const statusDot: Record<ServiceStatus, string> = {
  online: "bg-success",
  degraded: "bg-warning",
  offline: "bg-destructive",
};

function dayColor(v: number): string {
  if (v === 1) return "bg-success";
  if (v === 0.5) return "bg-warning";
  return "bg-destructive";
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

function StatusPill({ status }: { status: ServiceStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[12px] font-medium text-secondary-foreground">
      <span
        className={`size-1.5 rounded-full ${statusDot[status]} ${
          status !== "offline" ? "animate-pulse-dot" : ""
        }`}
      />
      {statusLabel[status]}
    </span>
  );
}

function LatencyPill({ ms }: { ms: number }) {
  const tone =
    ms > 150
      ? "bg-tint-orange text-warning"
      : ms > 50
        ? "bg-tint-blue text-primary"
        : "bg-tint-green text-success";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[12px] font-semibold tabular-nums ${tone}`}
    >
      {ms} ms
    </span>
  );
}

function UptimeBar({ days }: { days: number[] }) {
  return (
    <div
      className="flex items-end gap-[2.5px]"
      title="Uptime der letzten 30 Tage"
    >
      {days.map((v, i) => (
        <span
          key={i}
          className={`h-5 w-[5px] rounded-full ${dayColor(v)} transition-transform hover:scale-y-125`}
        />
      ))}
    </div>
  );
}

function ServiceRow({
  service,
  index,
}: {
  service: HomelabService;
  index: number;
}) {
  return (
    <article
      className="animate-rise rounded-3xl bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="flex items-start gap-3.5">
        <BrandIcon slug={service.icon} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[16px] font-semibold leading-tight text-card-foreground">
              {service.name}
            </h3>
            <LatencyPill ms={service.latencyMs} />
          </div>
          <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
            {service.description}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <UptimeBar days={service.uptimeDays} />
        <div className="flex flex-col items-end gap-1.5">
          <p className="text-[15px] font-semibold tabular-nums text-card-foreground">
            {service.uptimePercent.toFixed(2)}&nbsp;%
          </p>
          <StatusPill status={service.status} />
        </div>
      </div>
    </article>
  );
}

function NodeCard({ node, index }: { node: InfraNode; index: number }) {
  return (
    <article
      className="animate-rise rounded-3xl bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <BrandIcon slug={node.icon} size="sm" />
          <div className="min-w-0">
            <h3 className="text-[16px] font-semibold leading-tight text-card-foreground">
              {node.name}
            </h3>
            <p className="truncate text-[13px] text-muted-foreground">
              {node.description}
            </p>
          </div>
        </div>
        <span
          className={`mt-1 size-2 shrink-0 animate-pulse-dot rounded-full ${statusDot[node.status]}`}
          title={statusLabel[node.status]}
        />
      </div>

      <p className="mt-3 truncate text-[12px] tabular-nums text-muted-foreground">
        LAN {node.lanIp}
        {node.tailscale
          ? ` · Tailscale ${node.tailscale}`
          : " · kein Tailscale-Knoten"}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-muted/70 px-4 py-3">
          <p className="text-[18px] font-bold tracking-tight tabular-nums">
            {node.cpu}&nbsp;%
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            CPU
          </p>
        </div>
        <div className="rounded-2xl bg-muted/70 px-4 py-3">
          <p className="text-[18px] font-bold tracking-tight tabular-nums">
            {node.ramLabel}
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            RAM
          </p>
        </div>
      </div>
    </article>
  );
}

function Index() {
  const all = [...internalApps, ...managementServices];
  const online = all.filter((s) => s.status === "online").length;
  const issues = all.length - online;
  const avgUptime = (
    all.reduce((acc, s) => acc + s.uptimePercent, 0) / all.length
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* App Bar */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
              <Server className="size-4.5" strokeWidth={2.4} />
            </div>
            <span className="text-[17px] font-semibold tracking-tight">
              Homelab&nbsp;OS
            </span>
          </div>

          {/* Host-Schnellstatus (apps01) */}
          <div className="hidden items-center gap-4 rounded-full bg-card px-4 py-1.5 text-[12px] font-medium tabular-nums text-muted-foreground shadow-[var(--shadow-card)] md:flex">
            <span className="inline-flex items-center gap-1.5">
              <Cpu className="size-3.5 text-primary" strokeWidth={2.4} />
              {hostSummary.cpu}%
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MemoryStick className="size-3.5 text-primary" strokeWidth={2.4} />
              {hostSummary.ramFree} frei
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HardDrive className="size-3.5 text-primary" strokeWidth={2.4} />
              {hostSummary.diskFree} frei
            </span>
            <span className="text-foreground">{hostSummary.host}</span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-[13px] font-medium text-secondary-foreground">
            <span
              className={`size-2 animate-pulse-dot rounded-full ${
                issues > 0 ? "bg-warning" : "bg-success"
              }`}
            />
            {issues > 0 ? `${issues} Hinweise` : "Alle Systeme bereit"}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-9 px-5 pt-8">
        {/* Hero */}
        <section className="animate-rise flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-muted-foreground">
              Sonntag, 30. August · 16:16 Uhr
            </p>
            <h1 className="mt-1 text-[34px] font-bold leading-tight tracking-tight">
              Infrastruktur
            </h1>
          </div>
          <div className="flex items-center gap-4 text-[13px] font-medium tabular-nums text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">
                {online}/{all.length}
              </span>{" "}
              Dienste online
            </span>
            <span>
              <span className="font-semibold text-foreground">{avgUptime}&nbsp;%</span>{" "}
              Ø Uptime · 30 Tage
            </span>
          </div>
        </section>

        {/* Interne Apps */}
        <section className="space-y-3">
          <SectionTitle>Interne Apps</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {internalApps.map((s, i) => (
              <ServiceRow key={s.id} service={s} index={i} />
            ))}
          </div>
        </section>

        {/* Verwaltung & Infrastruktur */}
        <section className="space-y-3">
          <div className="flex items-end justify-between px-1">
            <SectionTitle>Verwaltung &amp; Infrastruktur</SectionTitle>
            <span className="text-[13px] text-muted-foreground">
              letzte 30 Tage
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {managementServices.map((s, i) => (
              <ServiceRow key={s.id} service={s} index={i} />
            ))}
          </div>
        </section>

        {/* Infrastruktur-Übersicht */}
        <section className="space-y-3">
          <SectionTitle>Infrastruktur-Übersicht</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {infraNodes.map((n, i) => (
              <NodeCard key={n.id} node={n} index={i} />
            ))}
          </div>
        </section>

        <p className="flex items-center justify-center gap-1.5 pt-2 text-center text-[12px] text-muted-foreground">
          <Wifi className="size-3.5" strokeWidth={2.4} />
          Homelab OS · Fritzbox 7590 AX · Tailscale-Netz aktiv · Aktualisierung alle 30 s
        </p>
      </main>
    </div>
  );
}
