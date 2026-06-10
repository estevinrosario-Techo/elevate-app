# Elévate — Gestor de Tareas Multiplataforma
**Entrega 2 – Semana 5 | Politécnico Grancolombiano**

Estudiante: Estevin David Suarez Rosario  
Módulo: Énfasis en Programación Móvil  
Tutor: William Matallana Porras  
Framework: Ionic 7 + Angular 17 + Capacitor 5

---

## 📱 Descripción
Elévate es una aplicación móvil multiplataforma (Android/iOS) para gestión de tareas personales con operación **100% offline** mediante almacenamiento local.

## 🚀 Inicio rápido

### Prerrequisitos
| Herramienta       | Versión mínima |
|-------------------|---------------|
| Node.js           | 18.x LTS      |
| npm               | 9.x           |
| Ionic CLI         | 7.x           |
| Angular CLI       | 17.x          |
| Android Studio    | Hedgehog+     |
| Java JDK          | 17 LTS        |

```bash
npm install -g @ionic/cli @angular/cli
```

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en navegador (desarrollo)
ionic serve
# Abre http://localhost:8100
```

### Generar APK para Android

```bash
# 1. Compilar proyecto web
ionic build

# 2. Agregar plataforma Android (primera vez)
npx cap add android

# 3. Sincronizar
npx cap sync android

# 4. Abrir en Android Studio
npx cap open android
# En Android Studio: Build → Build Bundle(s)/APK(s) → Build APK(s)
# El APK queda en: android/app/build/outputs/apk/debug/app-debug.apk
```

### Generar IPA para iOS (requiere macOS + Xcode 15)

```bash
ionic build
npx cap add ios
npx cap sync ios
npx cap open ios
# En Xcode: Product → Archive
```

---

## 📁 Estructura del proyecto

```
src/app/
├── models/
│   └── task.model.ts            # Interface TypeScript de Tarea
├── services/
│   ├── storage.service.ts       # Persistencia localStorage/IndexedDB
│   ├── task.service.ts          # CRUD de tareas + ordenamiento
│   ├── category.service.ts      # Gestión de categorías
│   ├── notification.service.ts  # Notificaciones locales
│   └── stats.service.ts         # Métricas de productividad
├── components/
│   └── task-form/               # Modal reutilizable crear/editar
├── pages/
│   ├── home/                    # Tab 1: Lista de tareas pendientes
│   ├── completed/               # Tab 2: Tareas completadas
│   ├── stats/                   # Tab 3: Estadísticas y gráficas
│   ├── settings/                # Tab 4: Configuración
│   │   └── categories/          # Gestión de categorías
│   └── task-detail/             # Detalle completo de tarea
└── tabs/                        # Componente contenedor de tabs
```

---

## ✅ Requerimientos implementados

| RF   | Funcionalidad           | Estado         |
|------|------------------------|----------------|
| RF01 | Crear tarea            | ✅ Completo     |
| RF02 | Listar tareas          | ✅ Completo     |
| RF03 | Editar tarea           | ✅ Completo     |
| RF04 | Eliminar tarea         | ✅ Completo     |
| RF05 | Marcar completada      | ✅ Completo     |
| RF06 | Filtrar y buscar       | ✅ Completo     |
| RF07 | Notificaciones locales | 🔄 70% — Web API implementada, pendiente prueba APK físico |
| RF08 | Gestión de categorías  | ✅ Completo     |
| RF09 | Estadísticas           | ✅ Completo     |
| RF10 | Persistencia offline   | ✅ Completo     |

**Total: 8/10 completos (80%) + 2 en progreso ≥ 70% requerido**

---

## 🛠 Stack tecnológico

- **Framework:** Ionic 7 + Angular 17 (standalone components)
- **Almacenamiento:** localStorage nativo (compatible IndexedDB con @ionic/storage-angular)
- **Notificaciones:** Web Notification API + @capacitor/local-notifications para nativo
- **Gráficas:** Chart.js 4 (doughnut + bar)
- **Build nativo:** Capacitor 5

---

## 📚 Referencias técnicas

1. [Ionic Docs](https://ionicframework.com/docs)
2. [Capacitor Local Notifications](https://capacitorjs.com/docs/apis/local-notifications)
3. [Angular Standalone Components](https://angular.io/guide/standalone-components)
4. [Chart.js Docs](https://www.chartjs.org/docs/latest/)
