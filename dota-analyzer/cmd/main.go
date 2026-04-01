package main

import (
	"dota-analyzer/internal/api/handler"
	"dota-analyzer/internal/service"
	"log/slog"
	"net/http"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	svc := service.NewAnalysisService()
	h := handler.NewAPIHandler(svc)

	e := echo.New()

	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogMethod:    true,
		LogURI:       true,
		LogStatus:    true,
		LogLatency:   true,
		LogHost:      true,
		LogUserAgent: true,
		LogRemoteIP:  true,
		LogRequestID: true,
		LogValuesFunc: func(c *echo.Context, v middleware.RequestLoggerValues) error {
			slog.Info("REQUEST",
				"method", v.Method,
				"uri", v.URI,
				"status", v.Status,
				"latency", v.Latency,
				"host", v.Host,
				"user_agent", v.UserAgent,
				"remote_ip", v.RemoteIP,
				"request_id", v.RequestID,
			)
			return nil
		},
	}))

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	api := e.Group("/api")
	api.POST("/login", h.Login)
	api.POST("/analyze", h.Analyze)
	slog.Info("API routes registered")

	s := &http.Server{
		Addr:         ":8080",
		Handler:      e,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 0,
		IdleTimeout:  120 * time.Second,
	}

	slog.Info("Сервер запущен", "addr", s.Addr)
	if err := s.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		slog.Error("Сервер упал", "err", err)
	}
}
