package handler

import (
	"dota-analyzer/internal/model"
	"dota-analyzer/internal/service"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v5"
)

type APIHandler struct {
	service      *service.AnalysisService
	defaultToken string
}

func NewAPIHandler(svc *service.AnalysisService) *APIHandler {
	token := os.Getenv("STRATZ_API_TOKEN")
	if token != "" {
		fmt.Println("✓ Default STRATZ token loaded from environment")
	} else {
		fmt.Println("⚠ Warning: STRATZ_API_TOKEN not set in environment")
	}
	return &APIHandler{
		service:      svc,
		defaultToken: token,
	}
}

type LoginRequest struct {
	SteamID int64  `json:"steamId"`
	Token   string `json:"token"`
}

type LoginResponse struct {
	PlayerName string `json:"playerName"`
}

func errJSON(msg string) map[string]any {
	return map[string]any{"error": msg}
}

func (h *APIHandler) Login(c *echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, errJSON("invalid body"))
	}
	if req.SteamID == 0 {
		return c.JSON(http.StatusBadRequest, errJSON("steamId required"))
	}

	// Если токен не передан, используем дефолтный
	token := req.Token
	fmt.Printf("Login request - SteamID: %d, Token provided: %v, Token length: %d\n",
		req.SteamID, token != "", len(token))

	if token == "" {
		token = h.defaultToken
		fmt.Printf("Using default token, length: %d\n", len(token))
	}

	if token == "" {
		return c.JSON(http.StatusBadRequest, errJSON("token required or not configured"))
	}

	name, err := h.service.ValidateCredentials(token, req.SteamID)
	if err != nil {
		fmt.Printf("Validation failed: %v\n", err)
		return c.JSON(http.StatusBadRequest, errJSON(err.Error()))
	}
	fmt.Printf("Login successful for: %s\n", name)
	return c.JSON(http.StatusOK, LoginResponse{PlayerName: name})
}

type AnalyzeRequest struct {
	SteamID            int64  `json:"steamId"`
	Token              string `json:"token"`
	PlayerMatches      int    `json:"playerMatches"`
	ParticipantMatches int    `json:"participantMatches"`
}

func (h *APIHandler) Analyze(c *echo.Context) error {
	var req AnalyzeRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, errJSON("invalid body"))
	}
	if req.SteamID == 0 {
		return c.JSON(http.StatusBadRequest, errJSON("steamId required"))
	}

	// Если токен не передан, используем дефолтный
	token := req.Token
	if token == "" {
		token = h.defaultToken
	}
	if token == "" {
		return c.JSON(http.StatusBadRequest, errJSON("token required or not configured"))
	}

	if req.PlayerMatches <= 0 || req.ParticipantMatches <= 0 {
		return c.JSON(http.StatusBadRequest, errJSON("matches must be > 0"))
	}
	if req.PlayerMatches > 100 {
		req.PlayerMatches = 100
	}
	if req.ParticipantMatches > 100 {
		req.ParticipantMatches = 100
	}
	rw := c.Response()

	flusher, ok := rw.(http.Flusher)
	if !ok {
		return c.JSON(http.StatusInternalServerError, errJSON("streaming not supported"))
	}

	rw.Header().Set("Content-Type", "text/event-stream")
	rw.Header().Set("Cache-Control", "no-cache")
	rw.Header().Set("Connection", "keep-alive")
	rw.Header().Set("X-Accel-Buffering", "no")
	rw.WriteHeader(http.StatusOK)
	flusher.Flush()

	ctx := c.Request().Context()

	send := func(v any) bool {
		select {
		case <-ctx.Done():
			return false
		default:
		}
		data, err := json.Marshal(v)
		if err != nil {
			return false
		}
		fmt.Fprintf(rw, "data: %s\n\n", data)
		flusher.Flush()
		return true
	}

	cacheHits, err := h.service.AnalyzeStream(
		ctx,
		token,
		req.SteamID,
		req.PlayerMatches,
		req.ParticipantMatches,
		service.StreamCallbacks{
			OnMeta: func(playerName string, total int) {
				send(map[string]any{
					"type":               "meta",
					"playerName":         playerName,
					"playerMatches":      req.PlayerMatches,
					"participantMatches": req.ParticipantMatches,
					"total":              total,
				})
			},
			OnMatch: func(match model.MatchResult, index int) {
				send(map[string]any{
					"type":  "match",
					"match": match,
					"index": index,
				})
			},
			OnProgress: func() {
				select {
				case <-ctx.Done():
					return
				default:
				}
				fmt.Fprintf(rw, ": ping\n\n")
				flusher.Flush()
			},
		},
	)

	if err != nil {
		send(map[string]any{"type": "error", "error": err.Error()})
		return nil
	}

	send(map[string]any{"type": "done", "cacheHits": cacheHits})
	return nil
}
