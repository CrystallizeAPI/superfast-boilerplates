
.PHONY: install-remix-run
install-remix-run: 
	@cd frameworks/remix-run/application && $(NPM) install

.PHONY: setup-remix-run
setup-remix-run: 
	@rm ./node_modules
	@ln -sf frameworks/remix-run/application/node_modules ./node_modules

.PHONY: serve-remix-run
serve-remix-run: setup-remix-run ## Serve the Remix Run Framework
	@cd frameworks/remix-run && $(MAKE) serve

.PHONY: test-remix-run
test-remix-run: setup-remix-run ## Test Remix Run Framework
	@cd frameworks/remix-run && $(MAKE) tests
