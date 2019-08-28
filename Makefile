NPM_BIN=$$(npm bin)

# ensure dependencies are up to date
install:
	npm i -g npm
	npm i
.PHONY: install

# start postgres in a docker container
postgres.start:
	docker-compose up -d postgres
.PHONY: postgres.start

# start postgres and watch the logs in the foreground
postgres.watch:
	docker-compose up postgres
.PHONY: postgres.watch

# stop the postgres container
postgres.stop:
	docker-compose stop postgres
.PHONY: postgres.stop

# execute all migrations
postgres.migrate:
	monarch migrate up src/api/sql/migrations
.PHONY: postgres.migrate

# stop the postgres container
# delete it's data volume
# start again (this action is destructive)
postgres.reset:
	docker-compose down --volumes
	$(MAKE) postgres.start
.PHONY: postgres.reset


# start the server
server.start:
	node src/api/index.js
.PHONY: server.start

# start the server and watch for changes
server.watch:
	$(NPM_BIN)/nodemon src/api/index.js
.PHONY: server.watch

# run the server test suite
server.test.all: postgres.start
	$(NPM_BIN)/mocha --config src/api/.mocharc.js src/api/tests/
.PHONY: server.test.all

# run the server test suite and re-run when files change
server.test.watch: postgres.start
	$(NPM_BIN)/mocha --config src/api/.mocharc.js src/api/tests/ --watch
.PHONY: server.test.watch

# run database tests only
server.test.db: postgres.start
	$(NPM_BIN)/mocha --config src/api/.mocharc.js src/api/tests/database.spec.js
.PHONY: server.test.db