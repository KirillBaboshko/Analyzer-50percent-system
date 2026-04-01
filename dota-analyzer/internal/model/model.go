package model

type PlayerStats struct {
	ID           int64  `json:"id"`
	Name         string `json:"name"`
	HeroID       int    `json:"heroID"`
	IsRadiant    bool   `json:"isRadiant"`
	WonThisMatch bool   `json:"wonThisMatch"`
	Kills        int    `json:"kills"`
	Deaths       int    `json:"deaths"`
	Assists      int    `json:"assists"`
	Wins         int    `json:"wins"`
	Losses       int    `json:"losses"`
}

func (p *PlayerStats) Total() int {
	return p.Wins + p.Losses
}

func (p *PlayerStats) WinRate() float64 {
	total := p.Total()
	if total <= 0 {
		return 0
	}
	return float64(p.Wins) / float64(total) * 100
}

type MatchResult struct {
	MatchID         int64          `json:"matchID"`
	StartDateTime   int64          `json:"startDateTime"`
	DurationSeconds int            `json:"durationSeconds"`
	GameMode        string         `json:"gameMode"`
	DidRadiantWin   bool           `json:"didRadiantWin"`
	Radiant         []*PlayerStats `json:"radiant"`
	Dire            []*PlayerStats `json:"dire"`
}

type AnalysisResult struct {
	PlayerName         string        `json:"playerName"`
	PlayerMatches      int           `json:"playerMatches"`
	ParticipantMatches int           `json:"participantMatches"`
	Matches            []MatchResult `json:"matches"`
	CacheHits          int           `json:"cacheHits"`
}
