
.PHONY: install-remix-run
install-remix-run: 
	@cd frameworks/remix-run/application && $(NPM) install

.PHONY: setup-remix-run
setup-remix-run: 
	@rm -f ./node_modules
	@ln -sf frameworks/remix-run/application/node_modules ./node_modules

.PHONY: serve-remix-run
serve-remix-run: setup-remix-run ## Serve the Remix Run Framework
	@cd frameworks/remix-run && $(MAKE) serve

.PHONY: stop-remix-run
stop-remix-run: setup-remix-run ## Stop the Remix Run Framework
	@cd frameworks/remix-run && $(MAKE) stop

.PHONY: test-remix-run
test-remix-run: setup-remix-run ## Test Remix Run Framework
	@cd frameworks/remix-run && $(MAKE) tests
