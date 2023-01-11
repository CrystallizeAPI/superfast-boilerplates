# Styles
YELLOW := $(shell echo "\033[00;33m")
RED := $(shell echo "\033[00;31m")
RESTORE := $(shell echo "\033[0m")

# Variables
.DEFAULT_GOAL := list
SHARED_FOLDERS := $(shell ls -1 shared/)
NPM := npm

.PHONY: list
list:
	@echo "${YELLOW}***${RED}***${RESTORE}***${YELLOW}***${RED}***${RESTORE}***${YELLOW}***${RED}***${RESTORE}***${YELLOW}***${RED}***${RESTORE}"
	@echo "${RED}Mono Repo ${YELLOW}Available targets${RESTORE}:"
	@grep -E '^[a-zA-Z-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf " ${YELLOW}%-15s${RESTORE} > %s\n", $$1, $$2}'
	@echo "${RED}=================================${RESTORE}"

.PHONY: install
install: ## Install the Mono Repo
	@cd tools/cs && $(NPM) install
	@cd frameworks/remix-run/application && $(NPM) install
	
.PHONY: serve-remixrun
serve-remixrun: ## Serve the Remix Run Framework
	@rm ./node_modules
	@ln -sf frameworks/remix-run/application/node_modules ./node_modules
	@cd frameworks/remix-run && $(MAKE) serve

.PHONY: serve-nextjs
serve-nextjs: ## Serve the NextJS Framework
	@rm ./node_modules
	@ln -sf frameworks/nextjs/application/node_modules ./node_modules
	@cd frameworks/nextjs/application && npm run dev

.PHONY: codeclean
codeclean: ## Code Clean
	@tools/cs/node_modules/.bin/prettier --config ./tools/cs/.prettierrc.json --ignore-path ./tools/cs/.prettierignore --write .
