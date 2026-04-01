export interface PlayerStats {
  id: number;
  name: string;
  heroID: number;
  isRadiant: boolean;
  wonThisMatch: boolean;
  kills: number;
  deaths: number;
  assists: number;
  wins: number;
  losses: number;
}

export interface MatchResult {
  matchID: number;
  startDateTime: number;
  durationSeconds: number;
  gameMode: string;
  didRadiantWin: boolean;
  radiant: PlayerStats[];
  dire: PlayerStats[];
}

export interface AnalysisResult {
  playerName: string;
  playerMatches: number;
  participantMatches: number;
  matches: MatchResult[];
  cacheHits: number;
}
