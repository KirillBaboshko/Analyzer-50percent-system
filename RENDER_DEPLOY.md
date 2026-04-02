# Деплой на Render.com

Пошаговая инструкция по развертыванию Dota 2 Analyzer на Render.

## Подготовка

### 1. Получить STRATZ API Token

1. Зайди на https://stratz.com/api
2. Зарегистрируйся или войди
3. Создай новый API токен
4. Сохрани токен - он понадобится при настройке

### 2. Загрузить проект на GitHub

Если еще не загрузил:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dota-analyzer.git
git push -u origin main
```

## Деплой на Render

### Вариант 1: Автоматический деплой (рекомендуется)

1. Зайди на https://render.com и зарегистрируйся
2. Подключи свой GitHub аккаунт
3. Нажми "New" → "Blueprint"
4. Выбери свой репозиторий `dota-analyzer`
5. Render автоматически найдет файл `render.yaml` и создаст оба сервиса

### Вариант 2: Ручная настройка

#### Backend (Go)

1. На dashboard Render нажми "New" → "Web Service"
2. Подключи GitHub репозиторий
3. Настройки:
   - **Name**: `dota-analyzer-backend`
   - **Region**: Frankfurt (или ближайший к тебе)
   - **Branch**: `main`
   - **Root Directory**: `dota-analyzer`
   - **Runtime**: Go
   - **Build Command**: `go build -o ../bin/analyzer cmd/main.go`
   - **Start Command**: `../bin/analyzer`
   - **Plan**: Free

4. Environment Variables:
   - `PORT` = `8080`
   - `STRATZ_API_TOKEN` = `твой_токен_от_stratz`

5. Нажми "Create Web Service"

#### Frontend (React)

1. На dashboard Render нажми "New" → "Static Site"
2. Подключи тот же GitHub репозиторий
3. Настройки:
   - **Name**: `dota-analyzer-frontend`
   - **Region**: Frankfurt
   - **Branch**: `main`
   - **Root Directory**: `dota-analyzer-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Environment Variables:
   - `VITE_API_URL` = `https://dota-analyzer-backend.onrender.com/api`
     (замени на URL твоего backend сервиса)

5. Нажми "Create Static Site"

## После деплоя

### Проверка работоспособности

1. Открой URL frontend сервиса (например, `https://dota-analyzer-frontend.onrender.com`)
2. Попробуй авторизоваться с Steam ID и токеном
3. Запусти анализ

### Важные моменты

1. **Первый запуск медленный**: На бесплатном плане Render "засыпает" сервисы после 15 минут неактивности. Первый запрос может занять 30-60 секунд.

2. **CORS**: Backend настроен на прием запросов от `*.onrender.com`. Если используешь другой домен, обнови CORS в `dota-analyzer/cmd/main.go`.

3. **Логи**: Смотри логи в Render dashboard → твой сервис → Logs

4. **Обновления**: При каждом push в GitHub Render автоматически пересобирает и деплоит проект.

## Ограничения бесплатного плана

- Backend "засыпает" после 15 минут неактивности
- 750 часов работы в месяц (достаточно для одного сервиса 24/7)
- Медленный холодный старт (30-60 секунд)
- Ограниченная память и CPU

## Переход на платный план

Если нужна стабильная работа без "засыпания":

1. Зайди в настройки сервиса
2. Выбери план "Starter" ($7/месяц)
3. Сервис будет работать 24/7 без задержек

## Кастомный домен

Если хочешь использовать свой домен:

1. В настройках Static Site → Custom Domain
2. Добавь свой домен
3. Настрой DNS записи согласно инструкциям Render
4. Обнови `VITE_API_URL` на frontend
5. Обнови CORS на backend

## Мониторинг

Render предоставляет:
- Логи в реальном времени
- Метрики использования CPU/Memory
- История деплоев
- Автоматические health checks

## Troubleshooting

### Backend не запускается

1. Проверь логи: Dashboard → Backend Service → Logs
2. Убедись что `STRATZ_API_TOKEN` установлен
3. Проверь что порт 8080 используется

### Frontend не подключается к Backend

1. Проверь `VITE_API_URL` в настройках frontend
2. Убедись что backend URL правильный (с `/api` в конце)
3. Проверь CORS настройки в `main.go`

### Медленная работа

1. Это нормально для бесплатного плана при холодном старте
2. Рассмотри переход на платный план
3. Или используй другой хостинг (Railway, Fly.io)

## Альтернативы Render

Если Render не подходит:

- **Railway.app**: Проще в настройке, $5 кредита бесплатно
- **Fly.io**: Быстрее, но требует Docker
- **Vercel** (только frontend) + **Railway** (backend)
- **VPS** (DigitalOcean, Hetzner): Полный контроль, от $4/месяц
