export type ServiceStatus = "online" | "degraded" | "offline";

export type Tint = "blue" | "green" | "orange" | "red" | "purple" | "teal";

export interface HomelabService {
  id: string;
  name: string;
  category: string;
  host: string;
  ip: string;
  port: number;
  status: ServiceStatus;
  uptimePercent: number;
  /** 30 Tage, 1 = ok, 0.5 = degraded, 0 = down */
  uptimeDays: number[];
  latencyMs: number;
  tint: Tint;
  icon: string;
}

export interface NodeStat {
  id: string;
  name: string;
  role: string;
  cpu: number;
  ram: number;
  disk: number;
  tempC: number;
  uptime: string;
  status: ServiceStatus;
}

function days(pattern: (i: number) => number): number[] {
  return Array.from({ length: 30 }, (_, i) => pattern(i));
}

const steady = () => 1;
const withBlip = (at: number[], level = 0.5) => (i: number) =>
  at.includes(i) ? level : 1;

export const services: HomelabService[] = [
  {
    id: "pve",
    name: "Proxmox VE",
    category: "Virtualisierung",
    host: "pve.homelab.lan",
    ip: "10.0.0.2",
    port: 8006,
    status: "online",
    uptimePercent: 99.98,
    uptimeDays: days(steady),
    latencyMs: 2,
    tint: "orange",
    icon: "server",
  },
  {
    id: "truenas",
    name: "TrueNAS SCALE",
    category: "Storage",
    host: "nas.homelab.lan",
    ip: "10.0.0.3",
    port: 443,
    status: "online",
    uptimePercent: 99.99,
    uptimeDays: days(steady),
    latencyMs: 3,
    tint: "teal",
    icon: "database",
  },
  {
    id: "pihole",
    name: "Pi-hole",
    category: "Netzwerk",
    host: "dns.homelab.lan",
    ip: "10.0.0.4",
    port: 80,
    status: "online",
    uptimePercent: 99.93,
    uptimeDays: days(withBlip([12])),
    latencyMs: 1,
    tint: "red",
    icon: "shield",
  },
  {
    id: "homeassistant",
    name: "Home Assistant",
    category: "Smart Home",
    host: "ha.homelab.lan",
    ip: "10.0.0.10",
    port: 8123,
    status: "online",
    uptimePercent: 99.87,
    uptimeDays: days(withBlip([5, 21])),
    latencyMs: 6,
    tint: "blue",
    icon: "home",
  },
  {
    id: "plex",
    name: "Plex Media Server",
    category: "Medien",
    host: "plex.homelab.lan",
    ip: "10.0.0.12",
    port: 32400,
    status: "degraded",
    uptimePercent: 98.61,
    uptimeDays: days(withBlip([3, 4, 18])),
    latencyMs: 14,
    tint: "orange",
    icon: "play",
  },
  {
    id: "nextcloud",
    name: "Nextcloud",
    category: "Cloud",
    host: "cloud.homelab.lan",
    ip: "10.0.0.14",
    port: 443,
    status: "online",
    uptimePercent: 99.95,
    uptimeDays: days(steady),
    latencyMs: 8,
    tint: "blue",
    icon: "cloud",
  },
  {
    id: "gitea",
    name: "Gitea",
    category: "Entwicklung",
    host: "git.homelab.lan",
    ip: "10.0.0.16",
    port: 3000,
    status: "online",
    uptimePercent: 99.9,
    uptimeDays: days(withBlip([9])),
    latencyMs: 4,
    tint: "green",
    icon: "git",
  },
  {
    id: "grafana",
    name: "Grafana",
    category: "Monitoring",
    host: "grafana.homelab.lan",
    ip: "10.0.0.18",
    port: 3001,
    status: "online",
    uptimePercent: 99.97,
    uptimeDays: days(steady),
    latencyMs: 5,
    tint: "purple",
    icon: "chart",
  },
  {
    id: "paperless",
    name: "Paperless-ngx",
    category: "Dokumente",
    host: "docs.homelab.lan",
    ip: "10.0.0.20",
    port: 8000,
    status: "offline",
    uptimePercent: 96.42,
    uptimeDays: days((i) => (i >= 26 ? 0 : i === 25 ? 0.5 : 1)),
    latencyMs: 0,
    tint: "green",
    icon: "file",
  },
  {
    id: "vaultwarden",
    name: "Vaultwarden",
    category: "Sicherheit",
    host: "vault.homelab.lan",
    ip: "10.0.0.22",
    port: 443,
    status: "online",
    uptimePercent: 100,
    uptimeDays: days(steady),
    latencyMs: 3,
    tint: "blue",
    icon: "lock",
  },
  {
    id: "uptimekuma",
    name: "Uptime Kuma",
    category: "Monitoring",
    host: "status.homelab.lan",
    ip: "10.0.0.24",
    port: 3002,
    status: "online",
    uptimePercent: 99.99,
    uptimeDays: days(steady),
    latencyMs: 2,
    tint: "teal",
    icon: "pulse",
  },
  {
    id: "jellyfin",
    name: "Jellyfin",
    category: "Medien",
    host: "jelly.homelab.lan",
    ip: "10.0.0.26",
    port: 8096,
    status: "online",
    uptimePercent: 99.78,
    uptimeDays: days(withBlip([15])),
    latencyMs: 7,
    tint: "purple",
    icon: "tv",
  },
];

export const nodes: NodeStat[] = [
  {
    id: "node1",
    name: "Proxmox Node 1",
    role: "Dell OptiPlex · i7-12700",
    cpu: 34,
    ram: 62,
    disk: 48,
    tempC: 46,
    uptime: "42 Tage",
    status: "online",
  },
  {
    id: "node2",
    name: "TrueNAS",
    role: "Self-Build · Ryzen 5 5600G",
    cpu: 12,
    ram: 38,
    disk: 71,
    tempC: 39,
    uptime: "87 Tage",
    status: "online",
  },
  {
    id: "node3",
    name: "Raspberry Pi 5",
    role: "DNS & Netzwerk-Dienste",
    cpu: 8,
    ram: 27,
    disk: 22,
    tempC: 41,
    uptime: "63 Tage",
    status: "online",
  },
];

export const networkStats = {
  wanDown: "842 Mbit/s",
  wanUp: "512 Mbit/s",
  blockedDns: "18,4 %",
  activeClients: 27,
};

export const statusLabel: Record<ServiceStatus, string> = {
  online: "Online",
  degraded: "Beeinträchtigt",
  offline: "Offline",
};
