# Styles
YELLOW := $(shell echo "\033[00;33m")
RED := $(shell echo "\033[00;31m")
RESTORE := $(shell echo "\033[0m")

# Variables
.DEFAULT_GOAL := list
SHARED_FOLDERS := $(shell ls -1 shared/)
NPM := npm
DEPENDENCIES := node npm caddy docker rsync git

.PHONY: list
list:
	@echo "${YELLOW}***${RED}***${RESTORE}***${YELLOW}***${RED}***${RESTORE}***${YELLOW}***${RED}***${RESTORE}***${YELLOW}***${RED}***${RESTORE}"
	@echo "${RED}Mono Repo: ${YELLOW}Available targets${RESTORE}:"
	@grep -E '^[a-zA-Z-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf " ${YELLOW}%-15s${RESTORE} > %s\n", $$1, $$2}'
	@for framework in `ls -1 frameworks`; do \
		echo "${RED}$$framework: ${YELLOW}Available targets${RESTORE}:"; \
		grep -E '^[a-zA-Z-]+:.*?## .*$$' Makefile.$$framework.mk | sort | awk 'BEGIN {FS = ":.*?## "}; {printf " ${YELLOW}%-15s${RESTORE} > %s\n", $$1, $$2}'; \
	done
	@echo "${RED}=================================${RESTORE}"

.PHONY: check-dependencies
check-dependencies:
	@for dependency in $(DEPENDENCIES); do \
		if ! command -v $$dependency &> /dev/null; then \
			echo "${RED}Error:${RESTORE} ${YELLOW}$$dependency${RESTORE} is not installed."; \
			exit 1; \
		fi; \
	done
	@echo "All ${YELLOW}dependencies are installed.${RESTORE}"

.PHONY: install
install: check-dependencies ## Install the Mono Repo
	@cd tools/cs && $(NPM) install
	@$(MAKE) install-remix-run
	@$(MAKE) install-nextjs

.PHONY: codeclean
codeclean: ## Code Clean
	@tools/cs/node_modules/.bin/prettier --config ./tools/cs/.prettierrc.json --ignore-path ./tools/cs/.prettierignore --write .

.PHONY: tests
tests: ## Tests
	@$(MAKE) test-remix-run
	@$(MAKE) test-nextjs

include Makefile.remix-run.mk
include Makefile.nextjs.mk
