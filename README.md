# AI Ticket IT - DDSo 2026 2C

Proyecto de aplicación móvil desarrollado con **React Native** y arquitectura separada en módulos **backend** y **frontend**.

## Estructura del proyecto

```
├── backend/           # API REST y lógica de servidor (Node.js + Express)
├── frontend/          # App móvil React Native (TypeScript)
├── docs/              # Documentación del proyecto
└── docker-compose.yml # Orquestación para desarrollo local
```

## Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Yarn](https://yarnpkg.com/) o [npm](https://www.npmjs.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Docker](https://www.docker.com/) (opcional, para backend local)

## Inicio rápido

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend (React Native)
```bash
cd frontend
npm install
cp .env.example .env
npx react-native run-android   # o run-ios
```

## Documentación

Consulta la carpeta `docs/` para detalles de arquitectura, endpoints de API y guías de despliegue.