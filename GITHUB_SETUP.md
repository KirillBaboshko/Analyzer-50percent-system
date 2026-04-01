# 📦 Инструкция по загрузке на GitHub

## Шаг 1: Инициализация Git репозитория

Откройте терминал в корне проекта и выполните:

```bash
# Инициализируйте Git репозиторий
git init

# Добавьте все файлы
git add .

# Создайте первый коммит
git commit -m "Initial commit: Dota 2 Analyzer v1.0"
```

## Шаг 2: Создайте репозиторий на GitHub

1. Зайдите на [GitHub](https://github.com)
2. Нажмите на "+" в правом верхнем углу
3. Выберите "New repository"
4. Заполните:
   - **Repository name**: `dota2-analyzer`
   - **Description**: `🎮 Веб-приложение для анализа винрейта участников матчей Dota 2`
   - **Visibility**: Public (или Private)
   - **НЕ** добавляйте README, .gitignore или LICENSE (они уже есть)
5. Нажмите "Create repository"

## Шаг 3: Подключите локальный репозиторий к GitHub

Скопируйте команды с GitHub (они будут показаны после создания репозитория):

```bash
# Добавьте remote
git remote add origin https://github.com/YOUR-USERNAME/dota2-analyzer.git

# Переименуйте ветку в main (если нужно)
git branch -M main

# Загрузите код на GitHub
git push -u origin main
```

## Шаг 4: Настройте GitHub репозиторий

### Добавьте описание и теги

1. Перейдите в Settings → General
2. Добавьте описание: `🎮 Веб-приложение для анализа винрейта участников матчей Dota 2`
3. Добавьте Website (если есть)
4. Добавьте Topics (теги):
   - `dota2`
   - `golang`
   - `react`
   - `typescript`
   - `stratz-api`
   - `game-analytics`
   - `winrate-analyzer`

### Включите GitHub Actions

1. Перейдите в Actions
2. Разрешите запуск workflows
3. CI/CD будет запускаться автоматически при push

### Настройте GitHub Pages (опционально)

Если хотите хостить фронтенд на GitHub Pages:

1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` (создайте её)
4. Folder: `/root`

## Шаг 5: Создайте релиз

```bash
# Создайте тег
git tag -a v1.0.0 -m "Release v1.0.0: Initial release"

# Загрузите тег
git push origin v1.0.0
```

Затем на GitHub:
1. Перейдите в Releases
2. Нажмите "Create a new release"
3. Выберите тег `v1.0.0`
4. Заполните описание релиза
5. Прикрепите бинарники (опционально)
6. Нажмите "Publish release"

## Шаг 6: Добавьте бейджи в README

Бейджи уже добавлены в README.md. Замените `your-username` на ваш GitHub username.

## Полезные команды Git

```bash
# Проверить статус
git status

# Добавить изменения
git add .

# Создать коммит
git commit -m "feat: добавить новую функцию"

# Загрузить на GitHub
git push

# Создать новую ветку
git checkout -b feature/new-feature

# Переключиться на main
git checkout main

# Слить ветку
git merge feature/new-feature

# Посмотреть историю
git log --oneline

# Откатить изменения
git reset --hard HEAD~1
```

## Структура коммитов

Используйте [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — новая функциональность
- `fix:` — исправление бага
- `docs:` — изменения в документации
- `style:` — форматирование кода
- `refactor:` — рефакторинг
- `test:` — добавление тестов
- `chore:` — обновление зависимостей

## Что дальше?

1. ⭐ Попросите друзей поставить звезду
2. 📝 Добавьте скриншоты в README
3. 🐛 Создайте Issue templates
4. 📖 Добавьте Wiki с документацией
5. 💬 Включите Discussions для сообщества
6. 🔄 Настройте автоматический деплой

## Проблемы?

Если что-то пошло не так:

```bash
# Удалить remote и добавить заново
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/dota2-analyzer.git

# Принудительная загрузка (осторожно!)
git push -f origin main
```

---

**Готово! Ваш проект теперь на GitHub! 🎉**
