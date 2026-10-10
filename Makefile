COMPOSE = docker compose

all: build

check-env:
	@test -f .env || { echo "Error: .env is missing. Run 'cp .env.example .env' and fill it in."; exit 1; }

up: check-env
	$(COMPOSE) up -d

build: check-env
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

stop:
	$(COMPOSE) stop

start:
	$(COMPOSE) start

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps -a

clean:
	$(COMPOSE) down --remove-orphans

fclean:
	$(COMPOSE) down --rmi all --volumes --remove-orphans

re: fclean all

.PHONY: all check-env up build down stop start logs ps clean fclean re
