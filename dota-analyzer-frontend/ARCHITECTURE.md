# Архитектура Frontend

## Структура проекта

```
src/
├── components/
│   ├── analysis/          # Компоненты для отображения результатов анализа
│   │   ├── ProgressBar.tsx
│   │   ├── Legend.tsx
│   │   ├── MatchCard.tsx
│   │   ├── TeamTable.tsx
│   │   └── index.ts
│   ├── ui/                # Переиспользуемые UI компоненты
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── LoginForm.tsx
│   ├── SettingsForm.tsx
│   └── ResultsView.tsx
├── hooks/                 # Кастомные React хуки
│   ├── useAuth.ts        # Управление аутентификацией
│   └── useAnalysis.ts    # Управление процессом анализа
├── utils/                 # Утилиты и хелперы
│   ├── format.ts         # Форматирование дат и времени
│   └── winrate.ts        # Расчеты винрейта
├── api.ts                # API клиент (SSE)
├── heroes.ts             # Маппинг героев
├── types.ts              # TypeScript типы
├── App.tsx               # Главный компонент
└── main.tsx              # Точка входа

```

## Принципы архитектуры

### 1. Разделение ответственности (Separation of Concerns)

- **Components**: Только UI логика и отображение
- **Hooks**: Бизнес-логика и управление состоянием
- **Utils**: Чистые функции без побочных эффектов
- **API**: Работа с сетью

### 2. Переиспользуемость

**UI компоненты** (`components/ui/`):
- `Button` — универсальная кнопка с вариантами стилей
- `Card` — карточка с заголовком

**Хуки**:
- `useAuth` — управление аутентификацией
- `useAnalysis` — управление процессом анализа

### 3. Композиция

`ResultsView` разбит на подкомпоненты:
- `ProgressBar` — прогресс загрузки
- `Legend` — легенда цветов
- `MatchCard` — карточка матча
- `TeamTable` — таблица команды

### 4. Типобезопасность

Все компоненты и функции типизированы TypeScript.

## Паттерны

### Custom Hooks

```typescript
// useAuth.ts - инкапсулирует логику аутентификации
const { isAuthenticated, login, logout } = useAuth();

// useAnalysis.ts - инкапсулирует логику анализа
const { matches, loading, startAnalysis } = useAnalysis();
```

### Compound Components

```typescript
<Card>
  <CardHeader>
    <CardTitle>Заголовок</CardTitle>
  </CardHeader>
</Card>
```

### Utility Functions

```typescript
// Чистые функции для расчетов
calculateWinRate(player);
getWinRateColor(wr);
formatTime(unix);
```

## Преимущества новой архитектуры

1. ✅ **Модульность** — каждый компонент отвечает за одну задачу
2. ✅ **Переиспользуемость** — UI компоненты можно использовать везде
3. ✅ **Тестируемость** — легко тестировать изолированные функции
4. ✅ **Масштабируемость** — легко добавлять новые фичи
5. ✅ **Читаемость** — понятная структура и именование
6. ✅ **Производительность** — оптимизированные компоненты

## Рекомендации по развитию

1. Добавить React.memo для оптимизации рендеринга
2. Использовать React Query для кэширования данных
3. Добавить unit тесты для utils и hooks
4. Добавить Storybook для UI компонентов
5. Использовать Context API для глобального состояния
