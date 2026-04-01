package service

import (
	"context"
	"dota-analyzer/internal/model"
	"dota-analyzer/internal/stratz"
	"fmt"
	"log/slog"
	"sync"
	"time"
)

type cachedStats struct{ Wins, Losses int }

type StreamCallbacks struct {
	OnMeta     func(playerName string, total int)
	OnMatch    func(match model.MatchResult, index int)
	OnProgress func()
}

type AnalysisService struct {
	cache   map[int64]*cachedStats
	mu      sync.RWMutex
	limiter *RateLimiter
}

func NewAnalysisService() *AnalysisService {
	return &AnalysisService{
		cache:   make(map[int64]*cachedStats),
		limiter: NewRateLimiter(400 * time.Millisecond),
	}
}

func (s *AnalysisService) ValidateCredentials(token string, steamID int64) (string, error) {
	client := stratz.NewClient(token)

	var resp stratz.ValidateResponse
	if err := s.query(context.Background(), client, stratz.ValidateQuery, map[string]interface{}{
		"steamAccountId": steamID,
	}, &resp, nil); err != nil {
		slog.Error("ValidateCredentials failed", "steamID", steamID, "err", err)
		if apiErr, ok := stratz.IsAPIError(err); ok {
			return "", fmt.Errorf("ошибка STRATZ (код %d): %s", apiErr.StatusCode, apiErr.Message)
		}
		return "", err
	}

	if resp.Player.SteamAccount.Name == "" {
		return "", fmt.Errorf("игрок не найден, проверь Steam ID")
	}
	return resp.Player.SteamAccount.Name, nil
}

func (s *AnalysisService) query(
	ctx context.Context,
	client *stratz.Client,
	gql string,
	vars map[string]interface{},
	out interface{},
	onWait func(),
) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		if err := s.limiter.Wait(ctx); err != nil {
			return err
		}

		err := client.Query(gql, vars, out)
		if err == nil {
			return nil
		}

		apiErr, ok := stratz.IsAPIError(err)
		if ok && apiErr.StatusCode == 429 {
			slog.Warn("STRATZ 429, waiting 65s")
			for i := 0; i < 65; i++ {
				select {
				case <-ctx.Done():
					return ctx.Err()
				case <-time.After(time.Second):
					if onWait != nil {
						onWait()
					}
				}
			}
			continue
		}

		return err
	}
}

func (s *AnalysisService) AnalyzeStream(
	ctx context.Context,
	token string,
	steamID int64,
	playerMatches int,
	participantMatches int,
	cb StreamCallbacks,
) (cacheHits int, err error) {

	client := stratz.NewClient(token)

	var matchesResp stratz.PlayerMatchesResponse
	if err := s.query(ctx, client, stratz.PlayerMatchesQuery, map[string]interface{}{
		"steamAccountId": steamID,
		"take":           playerMatches,
	}, &matchesResp, cb.OnProgress); err != nil {
		return 0, fmt.Errorf("ошибка загрузки матчей: %w", err)
	}

	total := len(matchesResp.Player.Matches)
	if cb.OnMeta != nil {
		cb.OnMeta(matchesResp.Player.SteamAccount.Name, total)
	}

	for idx, apiMatch := range matchesResp.Player.Matches {
		select {
		case <-ctx.Done():
			return cacheHits, ctx.Err()
		default:
		}

		matchResult := model.MatchResult{
			MatchID:         apiMatch.ID,
			StartDateTime:   apiMatch.StartDateTime,
			DurationSeconds: apiMatch.DurationSeconds,
			GameMode:        apiMatch.GameMode,
			DidRadiantWin:   apiMatch.DidRadiantWin,
			Radiant:         make([]*model.PlayerStats, 0, 5),
			Dire:            make([]*model.PlayerStats, 0, 5),
		}

		for _, p := range apiMatch.Players {
			won := (p.IsRadiant && apiMatch.DidRadiantWin) ||
				(!p.IsRadiant && !apiMatch.DidRadiantWin)

			stats := &model.PlayerStats{
				ID:           p.SteamAccountID,
				Name:         p.SteamAccount.Name,
				HeroID:       p.HeroID,
				IsRadiant:    p.IsRadiant,
				WonThisMatch: won,
				Kills:        p.Kills,
				Deaths:       p.Deaths,
				Assists:      p.Assists,
			}

			switch {
			case p.SteamAccountID == 0:
				stats.Name = "Аноним"
				stats.Wins = -1

			default:
				s.mu.RLock()
				cached := s.cache[p.SteamAccountID]
				s.mu.RUnlock()

				if cached != nil {
					stats.Wins = cached.Wins
					stats.Losses = cached.Losses
					cacheHits++
					if cb.OnProgress != nil {
						cb.OnProgress()
					}
				} else {
					var wrResp stratz.ParticipantWinrateResponse
					qErr := s.query(ctx, client, stratz.ParticipantWinrateQuery,
						map[string]interface{}{
							"steamAccountId": p.SteamAccountID,
							"take":           participantMatches,
						},
						&wrResp,
						cb.OnProgress,
					)

					if qErr != nil {
						if qErr == context.Canceled || qErr == context.DeadlineExceeded {
							return cacheHits, qErr
						}
						slog.Warn("failed to get participant stats",
							"steamID", p.SteamAccountID, "err", qErr)
						stats.Wins = -1
					} else {
						for _, m := range wrResp.Player.Matches {
							for _, mp := range m.Players {
								if mp.SteamAccountID == p.SteamAccountID {
									if (mp.IsRadiant && m.DidRadiantWin) ||
										(!mp.IsRadiant && !m.DidRadiantWin) {
										stats.Wins++
									} else {
										stats.Losses++
									}
									break
								}
							}
						}
						s.mu.Lock()
						s.cache[p.SteamAccountID] = &cachedStats{Wins: stats.Wins, Losses: stats.Losses}
						s.mu.Unlock()
					}

					if cb.OnProgress != nil {
						cb.OnProgress()
					}
				}
			}

			if p.IsRadiant {
				matchResult.Radiant = append(matchResult.Radiant, stats)
			} else {
				matchResult.Dire = append(matchResult.Dire, stats)
			}
		}

		if cb.OnMatch != nil {
			cb.OnMatch(matchResult, idx)
		}
	}

	return cacheHits, nil
}
