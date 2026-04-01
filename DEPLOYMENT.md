# 🚀 Руководство по развертыванию

## Локальное развертывание

### Режим разработки

**Backend:**
```bash
cd dota-analyzer
go run cmd/main.go
```

**Frontend:**
```bash
cd dota-analyzer-frontend
npm run dev
```

### Продакшен сборка

1. **Соберите фронтенд:**
```bash
cd dota-analyzer-frontend
npm run build
```

2. **Соберите бекэнд:**
```bash
cd dota-analyzer
go build -o analyzer cmd/main.go
```

3. **Скопируйте статику:**
```bash
# Windows
xcopy /E /I dota-analyzer-frontend\dist dota-analyzer\web\dist

# Linux/Mac
cp -r dota-analyzer-frontend/dist dota-analyzer/web/dist
```

4. **Запустите:**
```bash
cd dota-analyzer
./analyzer
```

---

## Docker развертывание

### Создайте Dockerfile для Backend

```dockerfile
# dota-analyzer/Dockerfile
FROM golang:1.26-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o analyzer cmd/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/analyzer .
COPY --from=builder /app/web ./web

EXPOSE 8080
CMD ["./analyzer"]
```

### Создайте docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./dota-analyzer
    ports:
      - "8080:8080"
    restart: unless-stopped
    environment:
      - PORT=8080
```

### Запуск

```bash
docker-compose up -d
```

---

## Облачное развертывание

### Heroku

1. **Установите Heroku CLI**
2. **Создайте приложение:**
```bash
heroku create dota2-analyzer
```

3. **Добавьте buildpacks:**
```bash
heroku buildpacks:add heroku/go
heroku buildpacks:add heroku/nodejs
```

4. **Деплой:**
```bash
git push heroku main
```

### Vercel (Frontend)

1. **Установите Vercel CLI:**
```bash
npm i -g vercel
```

2. **Деплой:**
```bash
cd dota-analyzer-frontend
vercel --prod
```

### Railway

1. **Подключите GitHub репозиторий**
2. **Railway автоматически определит Go проект**
3. **Настройте переменные окружения**
4. **Деплой произойдет автоматически**

### DigitalOcean App Platform

1. **Создайте новое приложение**
2. **Подключите GitHub репозиторий**
3. **Настройте:**
   - Build Command: `go build -o analyzer cmd/main.go`
   - Run Command: `./analyzer`
   - Port: `8080`
4. **Деплой**

---

## Переменные окружения

Создайте `.env` файл (не коммитьте его!):

```env
# Backend
PORT=8080
CORS_ORIGIN=http://localhost:5173

# Frontend (для production)
VITE_API_URL=http://localhost:8080
```

---

## Nginx конфигурация

Для продакшена с Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/dota2-analyzer/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # SSE support
        proxy_buffering off;
        proxy_cache off;
    }
}
```

---

## Мониторинг

### Логирование

Backend логи выводятся в stdout. Для продакшена используйте:

```bash
./analyzer 2>&1 | tee -a app.log
```

### Healthcheck endpoint

Добавьте в `router.go`:

```go
e.GET("/health", func(c echo.Context) error {
    return c.JSON(200, map[string]string{"status": "ok"})
})
```

---

## Безопасность

### Продакшен чеклист

- [ ] Используйте HTTPS (Let's Encrypt)
- [ ] Настройте CORS правильно
- [ ] Ограничьте rate limiting
- [ ] Используйте переменные окружения для секретов
- [ ] Регулярно обновляйте зависимости
- [ ] Настройте firewall
- [ ] Включите логирование
- [ ] Настройте мониторинг

---

## Обновление

### Backend

```bash
cd dota-analyzer
git pull
go build -o analyzer cmd/main.go
systemctl restart dota2-analyzer
```

### Frontend

```bash
cd dota-analyzer-frontend
git pull
npm install
npm run build
# Скопируйте dist в нужное место
```

---

## Troubleshooting

### Backend не запускается

1. Проверьте порт: `netstat -ano | findstr :8080`
2. Проверьте логи
3. Убедитесь что Go 1.26+ установлен

### Frontend не подключается к Backend

1. Проверьте CORS настройки в `router.go`
2. Проверьте URL API в `api.ts`
3. Проверьте что backend запущен

### SSE не работает

1. Убедитесь что `proxy_buffering off` в Nginx
2. Проверьте что браузер поддерживает SSE
3. Проверьте заголовки ответа

---

## Поддержка

Если возникли проблемы, создайте [Issue](https://github.com/your-username/dota2-analyzer/issues)
