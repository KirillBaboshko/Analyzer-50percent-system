import type { PlayerStats } from "../types";

export function calculateWinRate(p: PlayerStats): number {
  const total = p.wins + p.losses;
  if (total <= 0) return 0;
  return (p.wins / total) * 100;
}

export function getWinRateColor(wr: number): string {
  if (wr >= 60) return "text-green-300 font-bold";
  if (wr >= 50) return "text-yellow-300 font-bold";
  return "text-red-300 font-bold";
}

export function getWinRateBg(wr: number): string {
  if (wr >= 60) return "bg-green-500/25 hover:bg-green-500/35";
  if (wr >= 50) return "bg-yellow-500/25 hover:bg-yellow-500/35";
  return "bg-red-500/25 hover:bg-red-500/35";
}

export function isPrivateProfile(p: PlayerStats): boolean {
  return p.wins === -1 || (p.wins === 0 && p.losses === 0 && p.id !== 0);
}
