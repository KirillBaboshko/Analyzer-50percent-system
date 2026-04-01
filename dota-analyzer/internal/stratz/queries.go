package stratz

const ValidateQuery = `
query Validate($steamAccountId: Long!) {
  player(steamAccountId: $steamAccountId) {
    steamAccount { name }
  }
}
`

const PlayerMatchesQuery = `
query GetMatches($steamAccountId: Long!, $take: Int!) {
  player(steamAccountId: $steamAccountId) {
    steamAccount { name }
    matches(request: { take: $take }) {
      id
      didRadiantWin
      startDateTime
      durationSeconds
      gameMode
      players {
        steamAccountId
        steamAccount { name }
        isRadiant
        heroId
        kills
        deaths
        assists
      }
    }
  }
}
`

const ParticipantWinrateQuery = `
query GetWinrate($steamAccountId: Long!, $take: Int!) {
  player(steamAccountId: $steamAccountId) {
    matches(request: { take: $take }) {
      didRadiantWin
      players {
        steamAccountId
        isRadiant
      }
    }
  }
}
`

type ValidateResponse struct {
	Player struct {
		SteamAccount struct {
			Name string `json:"name"`
		} `json:"steamAccount"`
	} `json:"player"`
}

type PlayerMatchesResponse struct {
	Player struct {
		SteamAccount struct {
			Name string `json:"name"`
		} `json:"steamAccount"`
		Matches []APIMatch `json:"matches"`
	} `json:"player"`
}

type APIMatch struct {
	ID              int64       `json:"id"`
	DidRadiantWin   bool        `json:"didRadiantWin"`
	StartDateTime   int64       `json:"startDateTime"`
	DurationSeconds int         `json:"durationSeconds"`
	GameMode        string      `json:"gameMode"`
	Players         []APIPlayer `json:"players"`
}

type APIPlayer struct {
	SteamAccountID int64 `json:"steamAccountId"`
	SteamAccount   struct {
		Name string `json:"name"`
	} `json:"steamAccount"`
	IsRadiant bool `json:"isRadiant"`
	HeroID    int  `json:"heroId"`
	Kills     int  `json:"kills"`
	Deaths    int  `json:"deaths"`
	Assists   int  `json:"assists"`
}

type ParticipantWinrateResponse struct {
	Player struct {
		Matches []struct {
			DidRadiantWin bool `json:"didRadiantWin"`
			Players       []struct {
				SteamAccountID int64 `json:"steamAccountId"`
				IsRadiant      bool  `json:"isRadiant"`
			} `json:"players"`
		} `json:"matches"`
	} `json:"player"`
}
