# Planner Frontend

React + React Router 7 + TanStack Query + Tailwind CSS v4

## Стек

- **React 18** + **TypeScript**
- **React Router 7** — навигация, защищённые роуты
- **TanStack Query v5** — кеш, мутации, авто-рефетч
- **Tailwind CSS v4** (через `@tailwindcss/vite`)
- **Vite 6**
- **lucide-react** — иконки
- **date-fns** — работа с датами (ru locale)

## Структура

```
src/
├── api/           ← HTTP-клиент, auth/tasks API
├── components/
│   ├── auth/      ← ProtectedRoute, GuestRoute
│   ├── layout/    ← AppLayout (sidebar + mobile nav)
│   ├── tasks/     ← TaskCard, TaskForm
│   └── ui/        ← Button, Input, Select, Modal, Badge, Toast, Skeleton
├── hooks/         ← useAuth, useTasks (TanStack Query)
├── pages/         ← LoginPage, RegisterPage, DashboardPage, TasksPage, CalendarPage
└── types/         ← User, Task, Priority, etc.
```

## Быстрый старт

```bash
npm install
npm run dev
```

Откроется http://localhost:5173

Vite проксирует `/api/*` → `http://127.0.0.1:8000`
Убедись что backend запущен:
```bash
cd ../planner-backend
uvicorn app.main:app --reload
```

## Функционал

- **Авторизация** — регистрация, вход, выход, refresh токена через cookie
- **Dashboard** — задачи на сегодня, прогресс-кольцо
- **Все задачи** — фильтры: приоритет, статус, дата
- **Календарь** — выбор дня, просмотр задач по дате
- **Задачи** — создать, редактировать, удалить, отметить выполненной
- **Приоритеты** — низкий / средний / высокий (цветные бейджи)
- **Toast уведомления** — успех/ошибка
- **Skeleton loading** — плавная загрузка
- **Responsive** — sidebar на десктопе, bottom nav на мобиле
