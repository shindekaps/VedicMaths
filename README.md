# VedicPath — Full-Stack Vedic Mathematics eLearning Platform

<div align="center">

![VedicPath](https://img.shields.io/badge/VedicPath-v1.0-saffron?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![Go](https://img.shields.io/badge/Go-1.22-lightblue?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-green?style=flat-square)

**Master Vedic Mathematics through interactive lessons, adaptive practice, and gamified learning.**

[📖 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [🏗️ Architecture](#-architecture) • [📦 Tech Stack](#-tech-stack)

</div>

---

## 🎯 About VedicPath

VedicPath is a production-ready, full-stack eLearning platform for teaching **16 Vedic Mathematics Sutras** to students (grades 4–12), competitive exam aspirants, and curious adults.

**Key Features:**
- 📖 **16 Vedic Sutras** with animated step-by-step lessons
- ⚡ **Adaptive Practice Engine** — difficulty adjusts based on accuracy
- 🎮 **6 Game Modes** — Speed Blitz, Sutra Wars (live 1v1), Vedic Quest, and more
- 🏆 **Full Gamification** — XP, levels (1–50), badges, daily streaks, leaderboards
- 📊 **Progress Analytics** — mastery tracking, session history, performance insights
- 👨‍🏫 **Teacher Tools** — class management, student monitoring, homework assignment
- 🚀 **Production Ready** — Docker, Kubernetes, CI/CD, monitoring (Prometheus, Sentry)

---

## 🗂️ Repository Structure

```
vedicpath/
├── frontend/                    # React 18 + TypeScript SPA
│   ├── src/
│   │   ├── components/         # UI components & layouts
│   │   ├── pages/              # Route pages
│   │   ├── stores/             # Zustand state management
│   │   ├── api/                # API client & hooks
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # TypeScript definitions
│   │   └── assets/             # Images, fonts, styles
│   ├── public/
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md               # Frontend-specific docs
│
├── backend/                     # Go REST API
│   ├── cmd/
│   │   └── server/main.go      # Entry point
│   ├── internal/
│   │   ├── auth/               # Authentication service
│   │   ├── lessons/            # Learning engine
│   │   ├── practice/           # Practice sessions & problems
│   │   ├── gamification/       # XP, badges, leaderboards
│   │   ├── games/              # Game modes (Sutra Wars, etc)
│   │   ├── domain/             # Domain models
│   │   └── infrastructure/     # DB, cache, config
│   ├── migrations/             # SQL migrations
│   ├── tests/
│   ├── go.mod
│   ├── go.sum
│   ├── Makefile
│   └── README.md               # Backend-specific docs
│
├── infra/                       # Infrastructure & DevOps
│   ├── docker/
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.frontend
│   │   └── nginx.conf
│   ├── k8s/                     # Kubernetes manifests
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── postgres-statefulset.yaml
│   │   ├── redis-deployment.yaml
│   │   ├── hpa.yaml            # Horizontal Pod Autoscaler
│   │   └── secrets.yaml
│   ├── scripts/
│   │   ├── backup.sh
│   │   └── health-check.sh
│   └── README.md               # Infrastructure docs
│
├── docs/                        # Project documentation
│   ├── SETUP.md                # Local development setup
│   ├── PHASES.md               # 8-phase development guide
│   ├── API.md                  # API reference & endpoints
│   ├── ARCHITECTURE.md         # System design & flows
│   └── TROUBLESHOOTING.md      # Common issues & solutions
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI pipeline (tests, lint)
│       └── deploy.yml          # CD pipeline (build, push, deploy)
│
├── docker-compose.yml          # Local development environment
├── Makefile                    # Common commands
├── .gitignore
├── README.md                   # This file
└── ARCHITECTURE.md             # High-level architecture

```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose 20.10+
- Go 1.22+ (for local backend development)
- Node.js 20+ (for local frontend development)
- Make

### Local Development (1 minute)

```bash
# 1. Clone the repository
git clone https://github.com/yourorg/vedicpath.git
cd vedicpath

# 2. Start everything with Docker Compose
docker compose up -d

# 3. Verify services are running
curl http://localhost:8080/health        # Backend
curl http://localhost:5173               # Frontend
docker compose exec postgres psql -U vedicuser -d vedicpath -c "\dt"
```

**Expected output:**
```
localhost:8080/health → {"status":"ok","service":"vedicpath-api"}
localhost:5173 → React app loads
Database → users, sutras, user_progress, practice_sessions, user_gamification tables visible
```

### First User (Test the App)

```bash
# Register
curl -X POST http://localhost:8080/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "SecurePass123!",
    "username": "arjun_sharma",
    "grade": 10
  }'

# Login
TOKEN=$(curl -s -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"SecurePass123!"}' | jq -r '.access_token')

# Access protected endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/v1/users/me
```

---

## 📖 Documentation

### Core Docs (Read in This Order)

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System design, 3-tier architecture, data flows | 20 min |
| **[docs/SETUP.md](./docs/SETUP.md)** | Local dev environment, Docker, database setup | 15 min |
| **[docs/PHASES.md](./docs/PHASES.md)** | 8-phase development guide (16 weeks) | 30 min |
| **[docs/API.md](./docs/API.md)** | Complete API reference, all endpoints | 20 min |
| **[frontend/README.md](./frontend/README.md)** | React app structure, components, state management | 15 min |
| **[backend/README.md](./backend/README.md)** | Go services, database models, problem generator | 20 min |
| **[infra/README.md](./infra/README.md)** | Docker, Kubernetes, CI/CD, monitoring | 15 min |

### UI Design & Prototypes

- **[vedic-ui-design.jsx](https://drive.google.com/...)** — Interactive mockups of all 8 screens
- **[vedic-maths-tdd.jsx](https://drive.google.com/...)** — Technical design document with 11 sections

---

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                              │
│  React SPA (Vite) • Mobile Web (PWA) • Admin Dashboard         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / REST + WebSocket
┌────────────────────────────▼────────────────────────────────────┐
│                   API GATEWAY (Nginx)                           │
│  Rate Limiting • CORS • JWT Validation • Load Balancing        │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    API SERVICES (Go)                            │
│  ┌──────────────┬──────────────┬──────────────────────────────┐ │
│  │ Auth Service │Learning Svc  │  Gamification Service        │ │
│  │ (JWT, OAuth) │(Problems,    │  (XP, Badges,              │ │
│  │              │Lessons)      │   Leaderboards)            │ │
│  └──────────────┴──────────────┴──────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼──────┐    ┌───────▼──────┐    ┌──────▼──────┐
│ PostgreSQL   │    │ Redis Cache  │    │ S3 / Blob   │
│ (Primary DB) │    │ (Sessions,   │    │ Storage     │
│              │    │  Leaderboard)│    │ (Media)     │
└──────────────┘    └──────────────┘    └─────────────┘
```

### Key Features by Layer

**Frontend (React)**
- Lesson viewer with animations
- Practice sessions with timer
- Quiz mode
- 6 game modes (arcade, real-time, story)
- Dashboard with progress & analytics
- Leaderboard

**Backend (Go)**
- JWT authentication + OAuth2
- Unlimited problem generation (algorithmic)
- Adaptive difficulty engine
- XP & gamification system
- WebSocket for real-time games
- Real-time leaderboards (Redis)

**Data (PostgreSQL)**
- Users & roles
- Sutra definitions (16 total)
- User progress & mastery
- Practice sessions & results
- Gamification stats

---

## 📦 Tech Stack

### Frontend
- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Fast bundler
- **Zustand** — State management
- **React Query** — Server state & caching
- **React Router v6** — Routing
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Axios** — HTTP client

### Backend
- **Go 1.22** — Language
- **Gin** — HTTP framework (fast, lightweight)
- **GORM** — ORM (database abstraction)
- **PostgreSQL 16** — Relational database
- **Redis 7** — Cache & sessions
- **JWT** — Authentication
- **bcrypt** — Password hashing
- **gorilla/websocket** — Real-time communication

### DevOps
- **Docker** — Containerization
- **Docker Compose** — Local orchestration
- **Kubernetes** — Production orchestration
- **GitHub Actions** — CI/CD pipeline
- **Prometheus** — Metrics & monitoring
- **Grafana** — Visualization
- **Sentry** — Error tracking

---

## 📚 Learning the Codebase

### For Frontend Engineers
1. Start with `frontend/README.md`
2. Review `docs/ARCHITECTURE.md` (client section)
3. Explore React components in `frontend/src/components/`
4. Check API client in `frontend/src/api/`
5. Study state management in `frontend/src/stores/`

### For Backend Engineers
1. Start with `backend/README.md`
2. Review `docs/ARCHITECTURE.md` (backend section)
3. Understand domain models in `backend/internal/domain/`
4. Study service layer in `backend/internal/auth/`, `lessons/`, etc.
5. Review migrations in `backend/migrations/`

### For DevOps/Infrastructure
1. Start with `infra/README.md`
2. Review Dockerfiles in `infra/docker/`
3. Explore K8s manifests in `infra/k8s/`
4. Check GitHub Actions in `.github/workflows/`

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
go test ./... -race -cover

# Frontend tests
cd ../frontend
npm test
```

### Coverage Goals
- Backend: 80%+ coverage
- Frontend: 70%+ coverage
- Critical paths: 100%

---

## 🚀 Deployment

### Local Development
```bash
make dev       # Start Docker Compose
make logs      # View logs
make clean     # Stop & remove containers
```

### Staging
```bash
# Deploy to staging cluster
kubectl apply -f infra/k8s/ -n staging
```

### Production
```bash
# Canary deployment
kubectl set image deployment/vedicpath-backend \
  backend=ECR/vedicpath-backend:v1.0 -n production

# Monitor rollout
kubectl rollout status deployment/vedicpath-backend -n production
```

See [infra/README.md](./infra/README.md) for detailed deployment guide.

---

## 📊 Development Timeline

| Phase | Weeks | Deliverable | Status |
|-------|-------|-------------|--------|
| 1 — Setup | 2 | Docker, DB, scaffold | ✅ |
| 2 — Auth | 1–2 | JWT, register/login | ✅ |
| 3 — Learning | 2 | Problems, adaptive | ✅ |
| 4 — Frontend | 2 | React app | ✅ |
| 5 — Practice | 2 | Sessions, quiz | ✅ |
| 6 — Gamification | 2 | XP, badges, leaderboard | ✅ |
| 7 — Games | 3 | Speed Blitz, Sutra Wars | ✅ |
| 8 — Deployment | 2–3 | K8s, CI/CD | ✅ |

**Total: 16–18 weeks (4–5 months) with 2–3 engineers**

---

## 🔗 API Quick Reference

```
# Auth
POST   /v1/auth/register
POST   /v1/auth/login
POST   /v1/auth/refresh
POST   /v1/auth/logout
GET    /v1/auth/me

# Learning
GET    /v1/sutras
GET    /v1/sutras/:id
GET    /v1/lessons/:id
POST   /v1/practice/start

# Progress
GET    /v1/users/me/progress
GET    /v1/users/me/gamification
GET    /v1/leaderboard/weekly

# Games
WS     /v1/games/sutra-wars?room=ID
POST   /v1/games/speed-blitz/complete
```

Full API reference: [docs/API.md](./docs/API.md)

---

## 🛠️ Common Commands

```bash
# Development
make setup      # Install dependencies
make dev        # Start Docker Compose
make test       # Run all tests
make build      # Build Docker images

# Database
make migrate-up   # Run migrations
make db-shell     # Open psql
make db-backup    # Backup database

# Monitoring
make logs         # View logs
make metrics      # Open Prometheus
make logs-backend # Backend logs only
```

See `Makefile` for all commands.

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Go: `gofmt`, `go vet`, `golangci-lint`
- React: `eslint`, `prettier`, TypeScript strict mode
- Commits: Conventional Commits (feat:, fix:, docs:, etc.)

---

## 🔒 Security

- JWT tokens with 15-minute expiration
- Refresh tokens with 7-day expiration
- Bcrypt password hashing (cost 12)
- HTTPS/TLS enforced in production
- CORS whitelist (production domains only)
- Rate limiting: 100 req/min per IP, 5 req/min on auth
- SQL injection prevention (GORM parameterized queries)
- XSS protection (React escaping by default)

See [docs/SECURITY.md](./docs/SECURITY.md) for full security guidelines.

---

## 📞 Support & Documentation

- **Architecture & Design**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Setup & Installation**: [docs/SETUP.md](./docs/SETUP.md)
- **Development Phases**: [docs/PHASES.md](./docs/PHASES.md)
- **API Reference**: [docs/API.md](./docs/API.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- **Frontend Guide**: [frontend/README.md](./frontend/README.md)
- **Backend Guide**: [backend/README.md](./backend/README.md)
- **Infrastructure Guide**: [infra/README.md](./infra/README.md)

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 🙏 Acknowledgments

Built with reference to:
- **Vedic Mathematics** — Ancient Indian mathematical techniques
- **React & Go** communities for amazing tools
- **Kubernetes** for production-grade orchestration

---

<div align="center">

**Made with ❤️ for Vedic Mathematics learners worldwide**

[⭐ Star this repo](https://github.com/yourorg/vedicpath) • [📧 Email](mailto:team@vedicpath.com) • [🌐 Website](https://vedicpath.com)

</div>
