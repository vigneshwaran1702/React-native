# 🚀 Fullstack Task & Productivity Management App

A production-ready Fullstack Todo application featuring a **React Native CLI (TypeScript)** mobile client and a robust **Node.js/Express + TypeScript + MongoDB + JWT** backend API.

---

## 🏛️ Architecture Overview

```
todo-app/
│
├── web/                                   # Modern React + Vite Web Client
│   ├── src/
│   │   ├── components/                    # Header, StatsDashboard, FilterBar, TaskCard, Modals
│   │   ├── services/                      # api.ts (Axios + localStorage JWT)
│   │   ├── store/                         # authStore.ts, taskStore.ts (Zustand)
│   │   └── App.tsx                        # Productivity dashboard web interface
│   ├── package.json
│   └── vite.config.ts
│
├── mobile/                                # React Native CLI + TypeScript
│   ├── src/
│   │   ├── components/                    # TaskCard, StatsDashboard, FilterBar, Header, Badge
│   │   ├── screens/                       # LoginScreen, RegisterScreen, HomeScreen, AddTaskScreen, TaskDetailsScreen
│   │   ├── navigation/                    # RootNavigator (Dynamic Auth / App stack)
│   │   ├── services/                      # api.ts (Axios + JWT interceptors + AsyncStorage)
│   │   ├── store/                         # authStore.ts, taskStore.ts (Zustand)
│   │   ├── theme/                         # colors.ts, typography.ts
│   │   ├── types/                         # TypeScript interfaces
│   │   └── utils/                         # urgency.ts (Dynamic countdowns & scoring helpers)
│   ├── App.tsx
│   ├── index.js
│   ├── package.json
│   └── tsconfig.json
│
└── backend/                               # Node.js + Express + MongoDB (TypeScript)
    ├── src/
    │   ├── controllers/                   # auth.controller.ts, task.controller.ts
    │   ├── middleware/                    # auth.middleware.ts (JWT validation)
    │   ├── models/                        # User.ts, Task.ts
    │   ├── routes/                        # auth.routes.ts, task.routes.ts
    │   ├── services/                      # scoring.service.ts (Priority + Deadline calculation)
    │   ├── utils/                         # jwt.ts
    │   └── server.ts                      # Express server entrypoint & MongoDB connection
    ├── .env.example
    ├── .env
    ├── package.json
    └── tsconfig.json
```

---

## ✨ Features

### 🔐 Authentication
- User Registration with password hashing (`bcryptjs`)
- Secure Login & JWT Access Token generation
- Persistent session storage (`@react-native-async-storage/async-storage`)
- Automatic Authorization Bearer token injection on protected endpoints
- Instant logout & credential revocation

### 📋 Task Management
- **Create / Edit / Delete** tasks with rich fields:
  - Title, Description, Created At, Deadline, Priority, Status, Category, Completed At
- **One-tap completion toggle** with optimistic UI updates
- **Category classification**: `Work`, `Personal`, `Study`, `Health`, `Finance`, `Other`
- **Priority levels**: `HIGH`, `MEDIUM`, `LOW`

### ⚡ Smart Urgency & Priority Algorithm
Rather than simple static sorting, tasks are ranked using dynamic urgency scores:

$$\text{Score} = \text{Priority Weight} + \text{Deadline Urgency} + \text{Overdue Penalty}$$

- **Priority Weights**: `HIGH = 30`, `MEDIUM = 20`, `LOW = 10`
- **Deadline Urgency**: Tasks due in $\le 3$ hours receive $+45$ points; due today receive $+25$ points.
- **Overdue Penalty**: Past-due tasks receive $+50$ points plus additional urgency increments.
- **Completed Tasks**: Shifted to bottom automatically with a negative priority score.

### 📊 Productivity Dashboard & Filters
- **Visual Statistics Card**: Total tasks, Done, Pending, and % Completion progress bar
- **Overdue Indicator**: Prominent warning count and glow for urgent items
- **Instant Search**: Real-time title & description search
- **Multi-dimensional Filtering**: Category tabs, Priority pills, Status chips
- **Sorting Modes**: Smart Urgency, Due Date, Priority Rank, Created Date

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Mobile** | React Native CLI | Native mobile framework for iOS & Android |
| **Language** | TypeScript | Strict type safety across mobile & backend |
| **Navigation** | React Navigation | Native Stack navigation with modal screens |
| **State Management** | Zustand | Lightweight, high-performance state stores |
| **Network Client** | Axios | Configured with request/response interceptors |
| **Backend** | Node.js + Express | RESTful API service |
| **Database** | MongoDB | Document database with Mongoose ODM |
| **Security** | JWT + bcryptjs | Token-based auth & salted password hashing |
| **Storage** | AsyncStorage | Encrypted local token storage |

---

## 🚀 Quick Start Guide

### Root Commands (Run from root folder)
- **Start Backend**: `npm run backend:dev` (runs on `http://localhost:5000`)
- **Start Web Client**: `npm run web:dev` (runs on `http://localhost:3000`)
- **Start Mobile Metro**: `npm run mobile:start`
- **Run Android**: `npm run mobile:android`
- **Run iOS**: `npm run mobile:ios`

### Manual Setup
1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Web Client**:
   ```bash
   cd web
   npm install
   npm run dev
   ```
3. **Mobile Client**:
   ```bash
   cd mobile
   npm install
   npm start
   ```

---

## 📡 REST API Documentation

### Base URL: `http://localhost:5000/api`

### 1. Auth Endpoints
- **POST `/auth/register`**
  ```json
  // Request
  {
    "name": "Vignesh Kumar",
    "email": "vignesh@example.com",
    "password": "secretpassword123"
  }
  ```
- **POST `/auth/login`**
  ```json
  // Request
  {
    "email": "vignesh@example.com",
    "password": "secretpassword123"
  }
  ```
- **GET `/auth/me`** *(Protected - requires Bearer Token)*

### 2. Task Endpoints *(All Protected)*
- **GET `/tasks`**
  - Query parameters: `search`, `category`, `priority`, `status`, `sortBy` (`smart` | `deadline` | `priority` | `createdAt`)
- **GET `/tasks/stats`**
  - Returns total, completed, pending, completion rate, overdue, and priority breakdown.
- **POST `/tasks`**
  ```json
  // Request
  {
    "title": "Complete React Native Assignment",
    "description": "Finish authentication and task APIs",
    "deadline": "2026-08-30T18:00:00.000Z",
    "priority": "HIGH",
    "category": "Work"
  }
  ```
- **GET `/tasks/:id`**
- **PUT `/tasks/:id`**
- **PATCH `/tasks/:id/complete`**
- **DELETE `/tasks/:id`**
