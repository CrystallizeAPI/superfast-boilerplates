
.PHONY: install-nextjs
install-nextjs: 
	@cd frameworks/nextjs/application && $(NPM) install

.PHONY: setup-nextjs
setup-nextjs: 
	@rm ./node_modules
	@ln -sf frameworks/nextjs/application/node_modules ./node_modules

.PHONY: serve-nextjs
serve-nextjs: setup-nextjs ## Serve the NextJS Framework
	@cd frameworks/nextjs/application && npm run dev

.PHONY: test-nextjs
test-nextjs: setup-nextjs ## Test NextJS Framework
	@echo "@todo: No tests for now"
