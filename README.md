# Assignment 24 - Ecommerce Backend

A NestJS backend application for user authentication, user management, and product operations.

## Description

This project is a NestJS REST API built with TypeScript. It supports authentication, user management, and product management in a modular backend structure.

## Main features

- Authentication and token management
- User CRUD operations
- Product CRUD operations
- Environment-based configuration with dotenv
- Modular NestJS architecture

## Technology stack

- Node.js
- TypeScript
- NestJS
- Jest
- ESLint
- Prettier

## Project structure

- `src/`
  - `app.module.ts` - root module
  - `app.controller.ts` / `app.service.ts` - default app controller and service
  - `config/` - environment configuration loader
  - `modules/` - domain modules
    - `auth/` - authentication module, service, DTOs
    - `user/` - user module, service, DTOs, entities
    - `product/` - product module, service, DTOs, entities
- `test/` - end-to-end test setup
- `dist/` - compiled output (ignored)
- `node_modules/` - dependencies (ignored)

## Environment variables

Create a local `dev.env` file from `dev.env.example` before running the app.

Example variables:

```env
PORT=3000
HASH_ROUND=8
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
TOKENTIME=15m
REFRESH_TOKEN_EXPIRES=7d
DBLINK=mongodb://localhost:27017/your_database_name
REDISLINK=redis://default:password@localhost:6379
EMAILY=your-email@example.com
PASSWORDY=your-email-password
ENC_KEY=12345678901234567890123456789012
```

## How to run locally

```bash
npm install
cp dev.env.example dev.env
npm run start:dev
```

## Scripts

- `npm run start` - start the NestJS server
- `npm run start:dev` - start in watch mode
- `npm run build` - compile the app
- `npm run lint` - run ESLint
- `npm run test` - run tests
- `npm run test:e2e` - run end-to-end tests

## Notes

- Keep real secrets out of source control.
- Use `dev.env` only for local configuration.

## License

This repository does not include a license file by default.
