export type ServiceStatus = "online" | "degraded" | "offline";

export interface HomelabService {
  id: string;
  name: string;
  description: string;
  /** simple-icons slug key, z.B. "siBitwarden" */
  icon: string;
  /** Fallback-Buchstaben falls kein Marken-Icon existiert */
  fallback?: string;
  status: ServiceStatus;
  latencyMs: number;
  uptimePercent: number;
  /** 30 Tage: 1 = ok, 0.5 = beeinträchtigt, 0 = down */
  uptimeDays: number[];
  url?: string;
}

export interface InfraNode {
  id: string;
  name: string;
  icon: string;
  description: string;
  lanIp: string;
  tailscale: string | null;
  cpu: number;
  ramLabel: string;
  ramPercent: number;
  status: ServiceStatus;
  latencyMs: number;
}

function days(pattern: (i: number) => number): number[] {
  return Array.from({ length: 30 }, (_, i) => pattern(i));
}
const steady = () => 1;
const blip = (at: number[], level = 0.5) => (i: number) =>
  at.includes(i) ? level : 1;

export const internalApps: HomelabService[] = [
  {
    id: "vaultwarden",
    name: "Vaultwarden",
    description: "Passwort-Manager (apps01)",
    icon: "siBitwarden",
    status: "online",
    latencyMs: 12,
    uptimePercent: 99.99,
    uptimeDays: days(steady),
  },
  {
    id: "paperless",
    name: "Paperless-ngx",
    description: "Dokumentenverwaltung (apps01)",
    icon: "siPaperlessngx",
    status: "online",
    latencyMs: 109,
    uptimePercent: 99.87,
    uptimeDays: days(blip([14])),
  },
  {
    id: "matomo",
    name: "Matomo",
    description: "Web-Analytics (web01, öffentlich via Cloudflare-Tunnel)",
    icon: "siMatomo",
    status: "online",
    latencyMs: 144,
    uptimePercent: 99.72,
    uptimeDays: days(blip([6, 22])),
  },
];

export const managementServices: HomelabService[] = [
  {
    id: "pve",
    name: "Proxmox VE",
    description: "Hypervisor pve-nuc · Fallback via :8006 (Tailscale)",
    icon: "siProxmox",
    status: "online",
    latencyMs: 94,
    uptimePercent: 99.98,
    uptimeDays: days(steady),
  },
  {
    id: "portainer",
    name: "Portainer",
    description: "Docker-Verwaltung (infra01)",
    icon: "siPortainer",
    status: "online",
    latencyMs: 22,
    uptimePercent: 99.95,
    uptimeDays: days(steady),
  },
  {
    id: "pihole",
    name: "Pi-hole",
    description: "DNS und Werbeblocker (dns01)",
    icon: "siPihole",
    status: "degraded",
    latencyMs: 220,
    uptimePercent: 99.41,
    uptimeDays: days(blip([2, 3, 19])),
  },
  {
    id: "pbs",
    name: "Proxmox Backup Server",
    description: "Backups (backup01)",
    icon: "siProxmox",
    status: "online",
    latencyMs: 15,
    uptimePercent: 99.96,
    uptimeDays: days(steady),
  },
  {
    id: "traefik",
    name: "Traefik",
    description: "Reverse-Proxy Dashboard (infra01) · aktuell ohne UI-Route",
    icon: "siTraefikproxy",
    status: "online",
    latencyMs: 8,
    uptimePercent: 99.99,
    uptimeDays: days(steady),
  },
  {
    id: "kuma",
    name: "Uptime Kuma",
    description: "Uptime-Monitoring aller Dienste",
    icon: "siUptimekuma",
    status: "online",
    latencyMs: 6,
    uptimePercent: 100,
    uptimeDays: days(steady),
  },
  {
    id: "fritzbox",
    name: "Fritzbox",
    description: "Router / Internet-Zugang",
    icon: "siAvm",
    status: "degraded",
    latencyMs: 269,
    uptimePercent: 99.12,
    uptimeDays: days(blip([9, 10, 25])),
  },
];

export const infraNodes: InfraNode[] = [
  {
    id: "pve-nuc",
    name: "pve-nuc",
    icon: "siProxmox",
    description: "Hypervisor · kein eigener Tailscale-Knoten (via infra01-Route)",
    lanIp: "192.168.178.130",
    tailscale: null,
    cpu: 16,
    ramLabel: "23 GB",
    ramPercent: 72,
    status: "online",
    latencyMs: 0,
  },
  {
    id: "dns01",
    name: "dns01",
    icon: "siRaspberrypi",
    description: "Pi-hole DNS + Adblock (LXC)",
    lanIp: "192.168.178.131",
    tailscale: "100.100.92.63",
    cpu: 0,
    ramLabel: "127 MB",
    ramPercent: 12,
    status: "online",
    latencyMs: 0,
  },
  {
    id: "infra01",
    name: "infra01",
    icon: "siTraefikproxy",
    description: "Traefik + Portainer",
    lanIp: "192.168.178.132",
    tailscale: "100.123.54.72",
    cpu: 1,
    ramLabel: "3.21 GB",
    ramPercent: 40,
    status: "online",
    latencyMs: 0,
  },
  {
    id: "apps01",
    name: "apps01",
    icon: "siDocker",
    description: "Vaultwarden, Paperless, Dashboard",
    lanIp: "192.168.178.133",
    tailscale: "100.68.201.94",
    cpu: 3,
    ramLabel: "3.74 GB",
    ramPercent: 47,
    status: "online",
    latencyMs: 0,
  },
  {
    id: "web01",
    name: "web01",
    icon: "siCoolify",
    description: "Coolify + Matomo (Cloudflare-Tunnel)",
    lanIp: "192.168.178.134",
    tailscale: "100.87.67.112",
    cpu: 7,
    ramLabel: "6.05 GB",
    ramPercent: 76,
    status: "online",
    latencyMs: 0,
  },
  {
    id: "backup01",
    name: "backup01",
    icon: "siProxmox",
    description: "Proxmox Backup Server · kein eigener Tailscale-Knoten",
    lanIp: "192.168.178.135",
    tailscale: null,
    cpu: 0,
    ramLabel: "2.73 GB",
    ramPercent: 34,
    status: "online",
    latencyMs: 0,
  },
];

export const hostSummary = {
  host: "apps01",
  cpu: 2,
  ramFree: "2 GiB",
  ramPercent: 53,
  diskFree: "15.9 GB",
  diskPercent: 38,
};

export const statusLabel: Record<ServiceStatus, string> = {
  online: "Online",
  degraded: "Beeinträchtigt",
  offline: "Offline",
};
