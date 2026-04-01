package api

import (
	"dota-analyzer/internal/api/handler"
	"dota-analyzer/internal/service"
	"log/slog"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func NewRouter() *echo.Echo {
	e := echo.New()

	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodPost},
		AllowHeaders: []string{"Content-Type"},
	}))

	svc := service.NewAnalysisService()
	apiHandler := handler.NewAPIHandler(svc)

	g := e.Group("/api")
	g.POST("/login", apiHandler.Login)
	g.POST("/analyze", apiHandler.Analyze)

	slog.Info("API routes registered")
	return e
}
