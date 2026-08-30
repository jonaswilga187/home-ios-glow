import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Cloud,
  Cpu,
  Database,
  FileText,
  GitBranch,
  HardDrive,
  Home,
  Lock,
  MemoryStick,
  Play,
  Server,
  Shield,
  Thermometer,
  Tv,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import {
  networkStats,
  nodes,
  services,
  statusLabel,
  type HomelabService,
  type ServiceStatus,
} from "../lib/homelab-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Homelab OS – Infrastruktur-Übersicht" },
      {
        name: "description",
        content:
          "Live-Status aller Homelab-Dienste: Uptime, Latenz, Nodes und Netzwerk auf einen Blick.",
      },
      { property: "og:title", content: "Homelab OS – Infrastruktur-Übersicht" },
      {
        property: "og:description",
        content:
          "Live-Status aller Homelab-Dienste: Uptime, Latenz, Nodes und Netzwerk auf einen Blick.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const iconMap: Record<string, LucideIcon> = {
  server: Server,
  database: Database,
  shield: Shield,
  home: Home,
  play: Play,
  cloud: Cloud,
  git: GitBranch,
  chart: BarChart3,
  file: FileText,
  lock: Lock,
  pulse: Activity,
  tv: Tv,
};

const tintClass: Record<string, string> = {
  blue: "bg-tint-blue text-primary",
  green: "bg-tint-green text-success",
  orange: "bg-tint-orange text-warning",
  red: "bg-tint-red text-destructive",
  purple: "bg-tint-purple text-[oklch(0.55_0.18_305)]",
  teal: "bg-tint-teal text-[oklch(0.6_0.1_195)]",
};

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

function UptimeBar({ days }: { days: number[] }) {
  return (
    <div className="flex items-end gap-[2.5px]" title="Uptime der letzten 30 Tage">
      {days.map((v, i) => (
        <span
          key={i}
          className={`h-5 w-[5px] rounded-full ${dayColor(v)} ${
            v === 1 ? "opacity-90" : ""
          } transition-transform hover:scale-y-125`}
        />
      ))}
    </div>
  );
}

function ServiceCard({ service, index }: { service: HomelabService; index: number }) {
  const Icon = iconMap[service.icon] ?? Server;
  return (
    <article
      className="animate-rise rounded-3xl bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className={`flex size-11 items-center justify-center rounded-2xl ${tintClass[service.tint]}`}
          >
            <Icon className="size-5" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold leading-tight text-card-foreground">
              {service.name}
            </h3>
            <p className="text-[13px] text-muted-foreground">
              {service.ip}:{service.port}
            </p>
          </div>
        </div>
        <StatusPill status={service.status} />
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <UptimeBar days={service.uptimeDays} />
        <div className="text-right">
          <p className="text-[15px] font-semibold tabular-nums text-card-foreground">
            {service.uptimePercent.toFixed(2)}&nbsp;%
          </p>
          <p className="text-[12px] tabular-nums text-muted-foreground">
            {service.status === "offline" ? "keine Antwort" : `${service.latencyMs} ms`}
          </p>
        </div>
      </div>
    </article>
  );
}

function Meter({ value, icon: Icon }: { value: number; icon: LucideIcon }) {
  const color =
    value > 80 ? "bg-destructive" : value > 60 ? "bg-warning" : "bg-primary";
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={2.4} />
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-9 text-right text-[12px] font-medium tabular-nums text-muted-foreground">
        {value}%
      </span>
    </div>
  );
}

function Index() {
  const online = services.filter((s) => s.status === "online").length;
  const issues = services.length - online;
  const avgUptime = (
    services.reduce((acc, s) => acc + s.uptimePercent, 0) / services.length
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* App Bar */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
              <Server className="size-4.5" strokeWidth={2.4} />
            </div>
            <span className="text-[17px] font-semibold tracking-tight">
              Homelab&nbsp;OS
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-[13px] font-medium text-secondary-foreground">
            <span className="size-2 animate-pulse-dot rounded-full bg-success" />
            Alle Systeme bereit
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-9 px-5 pt-8">
        {/* Hero */}
        <section className="animate-rise">
          <p className="text-[13px] font-medium text-muted-foreground">
            Sonntag, 30. August · 16:12 Uhr
          </p>
          <h1 className="mt-1 text-[34px] font-bold leading-tight tracking-tight">
            Infrastruktur
          </h1>
        </section>

        {/* Übersicht-Kacheln */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Dienste online",
              value: `${online}/${services.length}`,
              sub: issues > 0 ? `${issues} melden Probleme` : "keine Probleme",
              icon: Activity,
            },
            {
              label: "Ø Uptime · 30 Tage",
              value: `${avgUptime} %`,
              sub: "SLA-Ziel: 99,5 %",
              icon: BarChart3,
            },
            {
              label: "Download / Upload",
              value: networkStats.wanDown,
              sub: `↑ ${networkStats.wanUp}`,
              icon: Wifi,
            },
            {
              label: "Aktive Clients",
              value: String(networkStats.activeClients),
              sub: `${networkStats.blockedDns} DNS geblockt`,
              icon: Users,
            },
          ].map((tile, i) => (
            <div
              key={tile.label}
              className="animate-rise rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <tile.icon
                className="size-5 text-primary"
                strokeWidth={2.2}
              />
              <p className="mt-3 text-[22px] font-bold tracking-tight tabular-nums">
                {tile.value}
              </p>
              <p className="text-[13px] font-medium text-card-foreground">
                {tile.label}
              </p>
              <p className="text-[12px] text-muted-foreground">{tile.sub}</p>
            </div>
          ))}
        </section>

        {/* Nodes */}
        <section className="space-y-3">
          <SectionTitle>Nodes &amp; Auslastung</SectionTitle>
          <div className="grid gap-3 md:grid-cols-3">
            {nodes.map((node, i) => (
              <article
                key={node.id}
                className="animate-rise space-y-3.5 rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[16px] font-semibold">{node.name}</h3>
                    <p className="text-[13px] text-muted-foreground">{node.role}</p>
                  </div>
                  <StatusPill status={node.status} />
                </div>
                <div className="space-y-2.5">
                  <Meter value={node.cpu} icon={Cpu} />
                  <Meter value={node.ram} icon={MemoryStick} />
                  <Meter value={node.disk} icon={HardDrive} />
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-3 text-[13px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Thermometer className="size-3.5" strokeWidth={2.4} />
                    {node.tempC} °C
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ArrowUp className="size-3.5" strokeWidth={2.4} />
                    {node.uptime}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Dienste */}
        <section className="space-y-3">
          <div className="flex items-end justify-between px-1">
            <SectionTitle>Dienste &amp; Uptime</SectionTitle>
            <span className="text-[13px] text-muted-foreground">
              letzte 30 Tage
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </section>

        {/* Netzwerk-Fußzeile */}
        <section className="animate-rise flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-tint-blue text-primary">
              <Wifi className="size-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[15px] font-semibold">WAN-Verbindung stabil</p>
              <p className="text-[13px] text-muted-foreground">
                Fritz!Box 7590 AX · VLAN 10 · kein Paketverlust
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-[13px] font-medium tabular-nums text-secondary-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ArrowDown className="size-4 text-primary" strokeWidth={2.4} />
              {networkStats.wanDown}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowUp className="size-4 text-success" strokeWidth={2.4} />
              {networkStats.wanUp}
            </span>
          </div>
        </section>

        <p className="pt-2 text-center text-[12px] text-muted-foreground">
          Homelab OS · Aktualisiert alle 30 Sekunden · uptime.kuma
        </p>
      </main>
    </div>
  );
}
