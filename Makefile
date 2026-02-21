.PHONY: help build up down restart logs logs-backend logs-frontend logs-db logs-redis migrate test clean \
		shell-backend shell-db shell-redis ps health restart-backend restart-frontend rebuild-backend \
		rebuild-frontend prune status

COMPOSE ?= docker compose

help:
	@echo "FinTrack Docker Management"
	@echo "=========================="
	@echo "make build           - Build all images"
	@echo "make up              - Start all services"
	@echo "make down            - Stop all services"
	@echo "make restart         - Restart all services"
	@echo "make logs            - View logs from all services"
	@echo "make logs-backend    - View backend logs"
	@echo "make logs-frontend   - View frontend logs"
	@echo "make logs-db         - View PostgreSQL logs"
	@echo "make logs-redis      - View Redis logs"
	@echo "make migrate         - Run database migrations"
	@echo "make test            - Run backend tests"
	@echo "make clean           - Remove all containers and volumes"
	@echo "make shell-backend   - Access backend shell"
	@echo "make shell-db        - Access database shell"
	@echo "make shell-redis     - Access redis-cli"
	@echo "make ps              - Show services status"
	@echo "make health          - Show running services"
	@echo "make restart-backend - Restart backend service"
	@echo "make restart-frontend - Restart frontend service"
	@echo "make rebuild-backend - Rebuild backend image without cache"
	@echo "make rebuild-frontend - Rebuild frontend image without cache"
	@echo "make prune           - Remove unused Docker objects"

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up -d
	@echo "✅ All services are running!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔌 Backend: http://localhost:8000"
	@echo "📚 API Docs: http://localhost:8000/docs"

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f

logs-backend:
	$(COMPOSE) logs -f backend

logs-frontend:
	$(COMPOSE) logs -f frontend

logs-db:
	$(COMPOSE) logs -f postgres

logs-redis:
	$(COMPOSE) logs -f redis

migrate:
	$(COMPOSE) exec backend alembic upgrade head

test:
	$(COMPOSE) exec backend pytest -v -o cache_dir=/tmp/.pytest_cache

clean:
	$(COMPOSE) down -v --remove-orphans
	docker system prune -f

shell-backend:
	$(COMPOSE) exec backend sh

shell-db:
	$(COMPOSE) exec postgres sh -c 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

shell-redis:
	$(COMPOSE) exec redis redis-cli

ps:
	$(COMPOSE) ps

health:
	@echo "Checking service health..."
	@$(COMPOSE) ps --services --filter "status=running"

restart-backend:
	$(COMPOSE) restart backend

restart-frontend:
	$(COMPOSE) restart frontend

rebuild-backend:
	$(COMPOSE) build --no-cache backend
	$(COMPOSE) up -d backend

rebuild-frontend:
	$(COMPOSE) build --no-cache frontend
	$(COMPOSE) up -d frontend

prune:
	docker system prune -a --volumes

status:
	$(COMPOSE) ps