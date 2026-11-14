# Frontend - AI Ticket IT

App móvil desarrollada con **React Native + TypeScript**.

## Estructura

```
src/
  components/   # Componentes reutilizables
  screens/      # Pantallas de la app
  navigation/   # Configuración de navegación
  services/     # Llamadas a la API
  store/        # Estado global (Redux/Zustand)
  hooks/        # Hooks personalizados
  utils/        # Utilidades y helpers
  assets/
    images/     # Imágenes estáticas
    fonts/      # Tipografías
    icons/      # Iconos
  theme/        # Colores, tipografía, espaciado
  constants/    # Constantes de la app
__tests__/      # Pruebas unitarias
```

## Scripts

- `npm start` - Iniciar Metro bundler
- `npm run android` - Ejecutar en Android
- `npm run ios` - Ejecutar en iOS
- `npm test` - Ejecutar pruebas

## Variables de entorno

Copiar `.env.example` a `.env` y configurar la URL de la API del backend.