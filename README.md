# 🐛 Bugtracker

Система управления задачами и проектами, построенная на React + TypeScript + Vite.

## 📋 Содержание

- [Установка и настройка](#-установка-и-настройка)
- [Запуск проекта](#-запуск-проекта)
- [Скрипты](#-скрипты)
- [Настройка Husky](#-настройка-husky)
- [Git Hooks](#-git-hooks)
- [Линтинг и форматирование](#-линтинг-и-форматирование)
- [Структура проекта](#-структура-проекта)
- [Технологии](#-технологии)
- [Docker](#-docker)
- [CI/CD](#-cicd)

## 🚀 Установка и настройка

### Системные требования

- Node.js >= 18.x
- npm >= 9.x
- Git

### Клонирование репозитория

```bash
git clone <repository-url>
cd bugtracker
```

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
VITE_API_URL=http://localhost:5000
```

### Первоначальная настройка

```bash
# Настройка Husky и Git hooks
npx husky install

# Форматирование кода
npm run format

# Проверка типов
npm run type-check

# Сборка проекта для проверки
npm run build
```

## 🏃‍♂️ Запуск проекта

### Режим разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### Производственная сборка

```bash
npm run build
npm run preview
```

## 📜 Скрипты

| Команда                | Описание                                   |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Запуск в режиме разработки                 |
| `npm run build`        | Создание production сборки                 |
| `npm run preview`      | Предварительный просмотр production сборки |
| `npm run lint`         | Проверка кода ESLint                       |
| `npm run lint:fix`     | Автоисправление ESLint ошибок              |
| `npm run lint:strict`  | Строгая проверка ESLint (0 предупреждений) |
| `npm run type-check`   | Проверка типов TypeScript                  |
| `npm run format`       | Форматирование кода Prettier               |
| `npm run format:check` | Проверка форматирования                    |
| `npm run test`         | Запуск тестов                              |

## 🐕 Настройка Husky

Husky автоматически настраивается при установке зависимостей через `prepare` скрипт.

### Ручная настройка Husky

Если автоматическая настройка не сработала:

```bash
# Инициализация Husky
npx husky install

# Добавление pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Добавление pre-push hook (создается автоматически из файла .husky/pre-push)
```

### Проверка настройки

```bash
# Проверить, что Husky установлен
ls -la .husky/

# Должны быть файлы:
# _/
# pre-commit
# pre-push
```

## 🔧 Git Hooks

### Pre-commit Hook

Выполняется перед каждым коммитом:

- ✅ Запуск `lint-staged` (линтинг и форматирование только измененных файлов)
- ✅ Проверка типов TypeScript
- ✅ Проверка на наличие `console.log` (предупреждение)
- ✅ Проверка на наличие `debugger` (блокирует коммит)

### Pre-push Hook

Выполняется перед каждым push:

- ✅ Полная проверка ESLint всего проекта
- ✅ Проверка типов TypeScript
- ✅ Проверка форматирования кода
- ✅ Сборка проекта
- ✅ Анализ размера bundle

### Обход хуков (не рекомендуется)

```bash
# Обход pre-commit
git commit --no-verify -m "commit message"

# Обход pre-push
git push --no-verify
```

## 🎨 Линтинг и форматирование

### ESLint

Конфигурация ESLint настроена в `eslint.config.js`:

- TypeScript правила
- React Hooks правила
- Правила форматирования
- Автоматическое исправление

```bash
# Проверка всех файлов
npm run lint

# Автоисправление
npm run lint:fix
```

### Prettier

Конфигурация в `.prettierrc`:

```json
{
	"singleQuote": true,
	"trailingComma": "all",
	"useTabs": true,
	"semi": true,
	"bracketSpacing": true,
	"printWidth": 100,
	"endOfLine": "auto"
}
```

### Lint-staged

Конфигурация в `.lintstagedrc` для обработки только staged файлов:

```json
{
	"*.{ts,tsx}": ["eslint --fix", "prettier --write"],
	"*.{js,jsx,json,css,md}": ["prettier --write"]
}
```

## 📁 Структура проекта

```
src/
├── api/                    # API слой
│   ├── auth/              # Аутентификация
│   ├── projects/          # Проекты
│   ├── tasks/             # Задачи
│   └── users/             # Пользователи
├── assets/                # Статические ресурсы
│   ├── fonts/             # Шрифты
│   └── logo.svg           # Логотип
├── components/            # React компоненты
│   ├── app/               # Основные компоненты приложения
│   ├── dashboard/         # Дашборд
│   ├── main/              # Основные UI компоненты
│   ├── project/           # Компоненты проектов
│   ├── task/              # Компоненты задач
│   ├── ui/                # UI компоненты (shadcn/ui)
│   └── users/             # Компоненты пользователей
├── context/               # React Context
├── lib/                   # Утилиты
├── pages/                 # Страницы приложения
├── types/                 # TypeScript типы
│   ├── assets.d.ts        # Типы для статических ресурсов
│   ├── common.ts          # Общие типы
│   └── index.ts           # Экспорт типов
└── main.tsx               # Точка входа
```

## 🛠 Технологии

### Основные

- **React 19** - UI библиотека
- **TypeScript** - Типизация
- **Vite** - Сборщик и dev сервер
- **React Router DOM** - Маршрутизация
- **Tailwind CSS** - CSS фреймворк

### Состояние и данные

- **TanStack Query** - Управление серверным состоянием
- **React Hook Form** - Работа с формами
- **Zod** - Валидация схем

### UI компоненты

- **Radix UI** - Headless UI компоненты
- **shadcn/ui** - Готовые UI компоненты
- **Lucide React** - Иконки
- **React Icons** - Дополнительные иконки

### Утилиты

- **clsx** + **tailwind-merge** - Условные CSS классы
- **class-variance-authority** - Варианты компонентов
- **React Toastify** - Уведомления

### Инструменты разработки

- **ESLint** - Линтер JavaScript/TypeScript
- **Prettier** - Форматтер кода
- **Husky** - Git hooks
- **lint-staged** - Линтинг staged файлов
- **TypeScript** - Проверка типов

## 🐳 Docker

### Локальная разработка

```bash
# Сборка образа
docker build -t bugtracker .

# Запуск контейнера
docker run -p 3000:3000 bugtracker
```

### Docker Compose (если есть backend)

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - '3000:3000'
    environment:
      - VITE_API_URL=http://backend:5000

  backend:
    # конфигурация backend
```

## 🔄 CI/CD

### GitHub Actions

Конфигурация в `.github/workflows/ci.yml`:

**Проверки качества кода:**

- Установка зависимостей
- Проверка форматирования
- ESLint проверка
- TypeScript проверка типов
- Сборка проекта
- Запуск тестов
- Анализ безопасности
- Анализ размера bundle

**Docker сборка:**

- Сборка Docker образа
- Тестирование контейнера

### Локальная проверка CI

Перед push можно локально проверить все этапы CI:

```bash
# Все проверки как в CI
npm run format:check
npm run lint
npm run type-check
npm run build
npm run test

# Проверка Docker сборки
docker build -t bugtracker-test .
```

## 🔧 Настройка IDE

### VS Code

Рекомендуемые расширения:

```json
{
	"recommendations": [
		"bradlc.vscode-tailwindcss",
		"esbenp.prettier-vscode",
		"dbaeumer.vscode-eslint",
		"ms-vscode.vscode-typescript-next"
	]
}
```

Настройки для автоформатирования:

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": true
	}
}
```

## 🐛 Отладка

### Частые проблемы

**1. Husky не работает**

```bash
# Переустановка Husky
rm -rf .husky
npx husky install
chmod +x .husky/pre-commit .husky/pre-push
```

**2. TypeScript ошибки**

```bash
# Очистка кэша TypeScript
rm -rf node_modules/.cache
npm run type-check
```

**3. ESLint ошибки**

```bash
# Автоисправление
npm run lint:fix
```

**4. Проблемы со сборкой**

```bash
# Очистка и переустановка
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

## 📝 Соглашения

### Коммиты

Используйте Conventional Commits:

```
feat: добавить новую функцию
fix: исправить ошибку
docs: обновить документацию
style: изменения форматирования
refactor: рефакторинг кода
test: добавить тесты
chore: обновить зависимости
```

### Ветки

```
main        - production код
develop     - разработка
feature/*   - новые функции
bugfix/*    - исправления
hotfix/*    - критические исправления
```

### Код

- Используйте TypeScript для всех новых файлов
- Покрывайте компоненты типами
- Следуйте правилам ESLint
- Пишите осмысленные имена переменных и функций
- Добавляйте комментарии для сложной логики

## 📞 Поддержка

Если у вас возникли проблемы:

1. Проверьте [Issues](../../issues) в репозитории
2. Создайте новый Issue с подробным описанием проблемы
3. Включите информацию о вашей системе (Node.js версия, ОС)

## 📄 Лицензия

[MIT License](LICENSE)
