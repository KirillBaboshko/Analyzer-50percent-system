import React from "react";
import { CheckCircle2, XCircle, Clock, Timer } from "lucide-react";
import type { MatchResult } from "../../types";
import { formatTime, formatDuration } from "../../utils/format";
import { TeamTable } from "./TeamTable.tsx";

interface Props {
  match: MatchResult;
  index: number;
  playerName?: string;
}

export const MatchCard: React.FC<Props> = ({ match, index, playerName }) => {
  const mainPlayer = [...match.radiant, ...match.dire].find((p) => p.name === playerName);
  const playerWon = mainPlayer?.wonThisMatch ?? false;

  return (
    <div
      className={`bg-dota-card/95 border-2 rounded-xl overflow-hidden shadow-xl transition-all hover:shadow-2xl backdrop-blur-sm ${
        playerWon
          ? "border-green-500/70 hover:border-green-500 ring-2 ring-green-500/20"
          : "border-red-500/70 hover:border-red-500 ring-2 ring-red-500/20"
      }`}
    >
      {/* Header */}
      <div
        className={`px-6 py-4 border-b-2 ${
          playerWon ? "bg-green-500/25 border-green-500/50" : "bg-red-500/25 border-red-500/50"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-white text-xl">#{index + 1}</span>
            <span className="text-sm text-dota-muted font-mono">ID: {match.matchID}</span>
            <span className="px-3 py-1.5 rounded-lg bg-dota-dark/80 text-sm text-dota-text font-medium border border-dota-border">
              {match.gameMode}
            </span>
            <span
              className={`px-4 py-1.5 rounded-lg font-bold text-base shadow-lg flex items-center gap-2 ${
                playerWon ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {playerWon ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  ПОБЕДА
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  ПОРАЖЕНИЕ
                </>
              )}
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm text-dota-text flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatTime(match.startDateTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Timer className="w-4 h-4" />
              {formatDuration(match.durationSeconds)}
            </span>
            <span className="font-semibold text-white">
              {match.didRadiantWin ? "💚 Radiant" : "💙 Dire"}
            </span>
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-dota-border">
        <TeamTable title="💚 Radiant" players={match.radiant} mainPlayerName={playerName} />
        <TeamTable title="💙 Dire" players={match.dire} mainPlayerName={playerName} />
      </div>
    </div>
  );
};
