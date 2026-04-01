import { useState } from "react";
import { apiAnalyzeStream, type StreamMeta } from "../api";
import type { MatchResult } from "../types";

export function useAnalysis() {
  const [meta, setMeta] = useState<StreamMeta | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async (
    steamId: number,
    token: string,
    playerMatches: number,
    participantMatches: number
  ) => {
    setLoading(true);
    setMeta(null);
    setMatches([]);
    setDone(false);
    setError(null);

    try {
      await apiAnalyzeStream(
        { steamId, token, playerMatches, participantMatches },
        {
          onMeta: (m) => setMeta(m),
          onMatch: (match) => setMatches((prev) => [...prev, match]),
          onDone: () => {
            setDone(true);
            setLoading(false);
          },
          onError: (msg) => {
            setError(msg);
            setLoading(false);
          },
        }
      );
    } catch (e: any) {
      setError(e.message ?? "Ошибка анализа");
      setLoading(false);
    }
  };

  const reset = () => {
    setMeta(null);
    setMatches([]);
    setDone(false);
    setError(null);
  };

  return {
    meta,
    matches,
    loading,
    done,
    error,
    startAnalysis,
    reset,
  };
}
