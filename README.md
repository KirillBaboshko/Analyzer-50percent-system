# 🎮 Dota 2 Analyzer

<div align="center">

![Dota 2](https://img.shields.io/badge/Dota%202-Analyzer-red?style=for-the-badge&logo=dota2)
![Go](https://img.shields.io/badge/Go-1.26-00ADD8?style=for-the-badge&logo=go)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Веб-приложение для анализа винрейта участников матчей Dota 2 через STRATZ API**

[Возможности](#-возможности) • [Установка](#-установка) • [Использование](#-использование) • [Архитектура](#-архитектура) • [Скриншоты](#-скриншоты)

</div>

---

## 📋 Описание

Dota 2 Analyzer — это современное веб-приложение для анализа матчей Dota 2. Приложение загружает последние матчи игрока и рассчитывает винрейт каждого участника, помогая оценить уровень игроков в команде.

### ✨ Ключевые особенности

- 🔄 **Стриминг в реальном времени** — результаты появляются по мере обработки (SSE)
- 🎨 **Современный UI** — темная тема в стиле Dota 2 с профессиональными иконками
- 📊 **Цветовая индикация** — мгновенная оценка винрейта (зеленый/желтый/красный)
- 🔒 **Определение закрытых профилей** — отдельная подсветка игроков с приватными данными
- ⚡ **Высокая производительность** — кэширование запросов и оптимизированная сборка
- 📱 **Адаптивный дизайн** — работает на мобильных и десктопах

---

## 🚀 Возможности

### Анализ матчей
- Загрузка до 50 последних матчей игрока
- Расчет винрейта каждого участника (до 100 матчей)
- Отображение K/D/A, героев и результатов
- Выделение основного игрока звездочкой

### Визуализация
- **Прогресс-бар** с анимацией загрузки
- **Цветовая схема**:
  - 🟢 Зеленый — WR ≥ 60%
  - 🟡 Желтый — WR ≥ 50%
  - 🔴 Красный — WR < 50%
  - 🟣 Фиолетовый — аноним
  - 🟠 Оранжевый — закрытый профиль (0 матчей)
- **Фон карточки** — зеленый для побед, красный для поражений
- **Названия героев** вместо ID

### Производительность
- Кэширование по `steamAccountID` — повторные запросы не делаются
- Rate limiting (300ms между запросами к STRATZ API)
- SSE стриминг — пользователь видит результаты сразу

---

## 🛠 Технологии

### Backend
- **Go 1.26** — современный язык для высокопроизводительных приложений
- **Echo v5** — быстрый веб-фреймворк
- **STRATZ GraphQL API** — источник данных о матчах
- **Server-Sent Events (SSE)** — стриминг результатов

### Frontend
- **React 19** — последняя версия с новыми хуками
- **TypeScript 5.9** — типобезопасность
- **Vite 8** — молниеносная сборка
- **Tailwind CSS 3** — утилитарные стили
- **Lucide React** — профессиональные SVG иконки

---

## 📦 Установка

### Требования
- **Go 1.26+**
- **Node.js 18+** и npm
- **STRATZ API токен** ([получить здесь](https://stratz.com/api))

### Клонирование репозитория

```bash
git clone https://github.com/your-username/dota2-analyzer.git
cd dota2-analyzer
```

### Backend

```bash
cd dota-analyzer
go mod download
go build -o analyzer.exe cmd/main.go
```

### Frontend

```bash
cd dota-analyzer-frontend
npm install
npm run build
```

---

## 🎯 Использование

### Запуск в режиме разработки

**Backend** (терминал 1):
```bash
cd dota-analyzer
go run cmd/main.go
```
Сервер запустится на `http://localhost:8080`

**Frontend** (терминал 2):
```bash
cd dota-analyzer-frontend
npm run dev
```
Приложение откроется на `http://localhost:5173`

### Запуск в продакшене

1. Соберите фронтенд:
```bash
cd dota-analyzer-frontend
npm run build
```

2. Скопируйте `dist/` в `dota-analyzer/web/dist/`

3. Запустите бекэнд:
```bash
cd dota-analyzer
./analyzer.exe
```

Приложение будет доступно на `http://localhost:8080`

### Получение STRATZ API токена

1. Зайдите на [stratz.com](https://stratz.com)
2. Авторизуйтесь через Steam
3. Перейдите в [API Settings](https://stratz.com/api)
4. Скопируйте свой токен

### Как использовать

1. Введите **Steam ID** (32-bit Dota ID) и **STRATZ токен**
2. Настройте количество матчей для анализа
3. Нажмите "Запустить анализ"
4. Результаты будут появляться в реальном времени

---

## 🏗 Архитектура

### Backend (Clean Architecture)

```
dota-analyzer/
├── cmd/
│   └── main.go              # Точка входа
├── internal/
│   ├── api/
│   │   ├── handler/         # HTTP handlers (SSE)
│   │   └── router.go        # Routing + CORS
│   ├── model/               # Модели данных
│   ├── service/             # Бизнес-логика
│   └── stratz/              # STRATZ API клиент
└── go.mod
```

### Frontend (Component-Based)

```
src/
├── components/
│   ├── analysis/            # Компоненты анализа
│   ├── ui/                  # Переиспользуемые UI
│   ├── LoginForm.tsx
│   ├── SettingsForm.tsx
│   └── ResultsView.tsx
├── hooks/                   # Custom hooks
│   ├── useAuth.ts
│   └── useAnalysis.ts
├── utils/                   # Утилиты
│   ├── format.ts
│   └── winrate.ts
└── api.ts                   # SSE клиент
```

Подробнее: [ARCHITECTURE.md](dota-analyzer-frontend/ARCHITECTURE.md)

---

## 📸 Скриншоты

### Форма входа
Чистый и интуитивный интерфейс для авторизации

### Настройки анализа
Гибкая настройка количества матчей

### Результаты анализа
- Прогресс-бар в реальном времени
- Цветовая индикация винрейта
- Детальная информация по каждому матчу
- Выделение основного игрока

---

## 🔧 API Endpoints

### `POST /api/login`
Валидация учетных данных

**Request:**
```json
{
  "steamId": 924787624,
  "token": "your-stratz-token"
}
```

**Response:**
```json
{
  "playerName": "Player Name"
}
```

### `POST /api/analyze` (SSE)
Анализ матчей с стримингом результатов

**Request:**
```json
{
  "steamId": 924787624,
  "token": "your-stratz-token",
  "playerMatches": 25,
  "participantMatches": 100
}
```

**Response:** Server-Sent Events stream
```
data: {"type":"meta","playerName":"...","total":25}
data: {"type":"match","match":{...},"index":1}
data: {"type":"match","match":{...},"index":2}
...
data: {"type":"done"}
```

---

## 🤝 Вклад в проект

Вклад приветствуется! Пожалуйста:

1. Форкните репозиторий
2. Создайте ветку для фичи (`git checkout -b feature/AmazingFeature`)
3. Закоммитьте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Запушьте в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

---

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE)

---

## 🙏 Благодарности

- [STRATZ](https://stratz.com) — за предоставление API
- [Echo](https://echo.labstack.com) — за отличный веб-фреймворк
- [Lucide](https://lucide.dev) — за красивые иконки
- [Tailwind CSS](https://tailwindcss.com) — за утилитарные стили

---

## 📧 Контакты

Если у вас есть вопросы или предложения, создайте [Issue](https://github.com/your-username/dota2-analyzer/issues)

---

<div align="center">

**Сделано с ❤️ для сообщества Dota 2**

⭐ Поставьте звезду, если проект вам понравился!

</div>
