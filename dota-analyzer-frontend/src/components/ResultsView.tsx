import React from "react";
import type { MatchResult } from "../types";
import type { StreamMeta } from "../api";
import { ProgressBar, Legend, MatchCard } from "./analysis";

interface Props {
  meta: StreamMeta | null;
  matches: MatchResult[];
  loading: boolean;
  done: boolean;
}

export const ResultsView: React.FC<Props> = ({ meta, matches, loading, done }) => {
  const loaded = matches.length;

  return (
    <div className="space-y-6">
      <ProgressBar meta={meta} loaded={loaded} loading={loading} done={done} />

      {loaded > 0 && <Legend />}

      <div className="space-y-5">
        {matches.map((match, i) => (
          <MatchCard key={match.matchID} match={match} index={i} playerName={meta?.playerName} />
        ))}
      </div>

      {loading && loaded === 0 && (
        <div className="space-y-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 bg-dota-card border border-dota-border rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
};
