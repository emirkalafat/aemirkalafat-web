export interface Tag {
  label: string;
  type: "software" | "hardware";
}

export interface Metric {
  label: string;
  value: string;
  valueColor?: string;
}

export interface Stats {
  panelLabel: string;
  statusColor: "green" | "yellow" | "red";
  metrics: Metric[];
  barPercent: number;
  barColor: string;
}

export type ChangelogFlag = "ADDED" | "FIXED" | "IMPRV" | "INIT" | "WARN";

export interface ChangelogItem {
  flag: ChangelogFlag;
  text: string;
}

export interface ChangelogEntry {
  version: string;
  label: string;
  date: string;
  isLatest: boolean;
  items: ChangelogItem[];
}

export interface ProjectLink {
  label: string;
  icon: string;
  url: string;
}

export interface Project {
  name: string;
  version: string;
  status: "STABLE" | "BETA";
  tags: Tag[];
  description: string;
  date: string;
  commit: string;
  stats: Stats;
  changelog: ChangelogEntry[];
  links?: ProjectLink[];
  language?: string;
  framework?: string;
  license?: string;
}

export const seedProjects: Project[] = [
  {
    name: "Quantum_Router_Core",
    version: "v2.4.1",
    status: "STABLE",
    tags: [
      { label: "Rust", type: "software" },
      { label: "Network Edge", type: "hardware" },
    ],
    description:
      "High-throughput packet routing engine utilizing zero-copy network I/O. Achieves 10Gbps line rate with sub-millisecond latency on commodity hardware.",
    date: "2024-05-12",
    commit: "8f2a9b1",
    language: "Rust / C",
    framework: "io_uring / AF_XDP",
    license: "MIT",
    links: [
      { label: "GITHUB_REPO", icon: "code", url: "#" },
      { label: "DOCUMENTATION", icon: "description", url: "#" },
      { label: "RELEASE_NOTES", icon: "new_releases", url: "#" },
    ],
    stats: {
      panelLabel: "System Status",
      statusColor: "green",
      metrics: [
        { label: "Uptime", value: "99.999%", valueColor: "text-tertiary" },
        { label: "Latency", value: "0.4ms", valueColor: "text-tertiary" },
      ],
      barPercent: 85,
      barColor: "bg-tertiary",
    },
    changelog: [
      {
        version: "v2.4.1",
        label: "Hotfix Implementation",
        date: "2024-05-12 16:00:00 UTC",
        isLatest: true,
        items: [
          {
            flag: "FIXED",
            text: "Resolved memory leak in TCP teardown sequence under high-throughput conditions.",
          },
          {
            flag: "FIXED",
            text: "Updated cryptographic dependencies to patch CVE-2024-8721.",
          },
        ],
      },
      {
        version: "v2.4.0",
        label: "Feature Release",
        date: "2024-03-22 10:30:00 UTC",
        isLatest: false,
        items: [
          {
            flag: "ADDED",
            text: "Introduced native IPv6 dual-stack support for all routing paths.",
          },
          {
            flag: "IMPRV",
            text: "Refactored BGP routing tables for 30% lookup speed increase.",
          },
        ],
      },
      {
        version: "v2.3.0",
        label: "Performance Pass",
        date: "2024-01-15 08:00:00 UTC",
        isLatest: false,
        items: [
          {
            flag: "IMPRV",
            text: "Migrated from epoll to io_uring for async I/O operations.",
          },
          {
            flag: "IMPRV",
            text: "Reduced context switches by 62% under sustained load conditions.",
          },
        ],
      },
    ],
  },
  {
    name: "Neural_Vision_Array",
    version: "v0.9.4-rc2",
    status: "BETA",
    tags: [
      { label: "CUDA/C++", type: "software" },
      { label: "TensorRT", type: "software" },
    ],
    description:
      "A high-performance, edge-computed computer vision pipeline designed for real-time anomaly detection in industrial manufacturing environments. Utilizes a custom C++ inference engine compiled for embedded ARM architectures.",
    date: "2024-10-24",
    commit: "3c9d1a4",
    language: "C++20 / Rust",
    framework: "TensorRT / OpenCV",
    license: "Apache 2.0",
    links: [
      { label: "GITHUB_REPO", icon: "code", url: "#" },
      { label: "DOCUMENTATION_WIKI", icon: "menu_book", url: "#" },
      { label: "DOWNLOAD_BINARIES", icon: "download", url: "#" },
    ],
    stats: {
      panelLabel: "Inference Node",
      statusColor: "yellow",
      metrics: [
        { label: "FPS", value: "144.2", valueColor: "text-on-surface" },
        { label: "VRAM Usage", value: "94%", valueColor: "text-error" },
      ],
      barPercent: 94,
      barColor: "bg-error",
    },
    changelog: [
      {
        version: "v0.9.4-rc2",
        label: "Optimization Pass",
        date: "2024-10-24 14:32:00 UTC",
        isLatest: true,
        items: [
          {
            flag: "ADDED",
            text: "Implemented multithreaded tensor allocation for 15% performance gain on edge devices.",
          },
          {
            flag: "ADDED",
            text: "New generic API interface for custom model loading via JSON config.",
          },
          {
            flag: "FIXED",
            text: "Resolved memory leak in thermal calibration routine during extended uptime (>72h).",
          },
          {
            flag: "FIXED",
            text: "Corrected bounding box coordinate drift at edges of ultra-wide FoV lenses.",
          },
        ],
      },
      {
        version: "v0.9.3",
        label: "Architecture Update",
        date: "2024-09-12 09:15:00 UTC",
        isLatest: false,
        items: [
          {
            flag: "ADDED",
            text: "Initial support for INT8 quantization pipelines.",
          },
          {
            flag: "IMPRV",
            text: "Refactored data logging system to use asynchronous I/O, reducing main thread latency.",
          },
          {
            flag: "FIXED",
            text: "Handled edge case where disconnected hardware trigger would cause segmentation fault.",
          },
        ],
      },
      {
        version: "v0.9.0",
        label: "Initial Alpha",
        date: "2024-05-01 00:00:00 UTC",
        isLatest: false,
        items: [
          {
            flag: "INIT",
            text: "INITIAL SYSTEM COMPILATION AND RELEASE. CORE ARCHITECTURE ESTABLISHED.",
          },
        ],
      },
    ],
  },
  {
    name: "Embedded_Signal_Core",
    version: "v1.1.0",
    status: "STABLE",
    tags: [
      { label: "C", type: "software" },
      { label: "ARM Cortex-M4", type: "hardware" },
      { label: "FreeRTOS", type: "software" },
    ],
    description:
      "Low-latency digital signal processing pipeline for embedded sensor nodes. Implements FFT-based frequency analysis with hardware-accelerated DSP instructions.",
    date: "2024-08-03",
    commit: "a1f4c22",
    language: "C99 / ARM Assembly",
    framework: "FreeRTOS / CMSIS-DSP",
    license: "MIT",
    links: [
      { label: "GITHUB_REPO", icon: "code", url: "#" },
      { label: "DATASHEET", icon: "description", url: "#" },
      { label: "DOWNLOADS", icon: "download", url: "#" },
    ],
    stats: {
      panelLabel: "DSP Node",
      statusColor: "green",
      metrics: [
        { label: "Latency", value: "1.2ms", valueColor: "text-tertiary" },
        { label: "CPU Load", value: "38%", valueColor: "text-tertiary" },
      ],
      barPercent: 38,
      barColor: "bg-tertiary",
    },
    changelog: [
      {
        version: "v1.1.0",
        label: "DSP Enhancements",
        date: "2024-08-03 12:00:00 UTC",
        isLatest: true,
        items: [
          {
            flag: "ADDED",
            text: "Hardware FPU support for Cortex-M4 floating-point operations.",
          },
          {
            flag: "IMPRV",
            text: "Reduced interrupt latency by 40% via NVIC priority rebalancing.",
          },
          {
            flag: "FIXED",
            text: "Fixed edge case in DMA transfer causing occasional buffer overflow on burst writes.",
          },
        ],
      },
      {
        version: "v1.0.0",
        label: "Initial Release",
        date: "2024-05-01 00:00:00 UTC",
        isLatest: false,
        items: [
          {
            flag: "INIT",
            text: "Initial release. Basic FFT pipeline with 1024-point transform.",
          },
          {
            flag: "ADDED",
            text: "FreeRTOS task scheduler integration for real-time operation.",
          },
          {
            flag: "WARN",
            text: "SPI bus arbitration under concurrent DMA access is not yet fully validated.",
          },
        ],
      },
    ],
  },
];
