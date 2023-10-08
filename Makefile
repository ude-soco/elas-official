help:
	@cat $(MAKEFILE_LIST) | docker run --rm -i --platform linux/amd64 xanders/make-help

##
## Run container images locally
##

compose = docker compose -f compose.yaml

# Clean, rebuild and run
all: clean build run

# Start all services for development using Tilt for live container updates
tilt:
	@tilt up
	@$(compose) down

# Start all services using regular configuration
run: stop
	@$(compose) up --force-recreate

# Start all services and watch for changes
watch: stop
	@$(compose) watch

start: run
up: run

# Stop all services
stop:
	@$(compose) down --remove-orphans

down: stop

# Remove services, volumes, and locally built images
clean:
	@$(compose) down --volumes --remove-orphans --rmi local

# Remove services, volumes, and all images
cleanall:
	@$(compose) down --volumes --remove-orphans --rmi all

# Build all container images
build:
	@$(compose) build

.PHONY: help all tilt run start up stop down clean cleanall build
