package service

import (
	"context"
	"time"
)

type RateLimiter struct {
	ticker *time.Ticker
}

func NewRateLimiter(interval time.Duration) *RateLimiter {
	return &RateLimiter{
		ticker: time.NewTicker(interval),
	}
}

func (r *RateLimiter) Wait(ctx context.Context) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-r.ticker.C:
		return nil
	}
}

func (r *RateLimiter) Stop() {
	r.ticker.Stop()
}
