# Real-time chat

Учебный проект сервис чата в реальном времени с JWT авторизацией

## Технологии

- NestJs
- PostgreSQL
- Prisma
- JWT
- WebSocket
- Socket.io

## Запуск

1. Клонировать репозиторий
2. Установить зависимости: `yarn install`
3. Создать `.env` файл
4. Поднять БД: `docker-compose -f docker-compose.postgres.yaml up -d`
5. Применить миграции: `yarn prisma migrate dev`
6. Запустить: `yarn start:dev`

## Переменные окружения

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test
JWT_SECRET=your_secret

## API

Документация по адресу http://localhost:3000/api

