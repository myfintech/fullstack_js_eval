NPM_BIN=$$(npm bin)

# execute all migrations
postgres.migrate:
	monarch migrate up src/api/sql/migrations
.PHONY: postgres.migrate

# stop the postgres container
# delete it's data volume
# start again (this action is destructive)
postgres.reset:
    # Ran into an issue setting up workspace again. Updated the command to check if the database exists
	dropdb --if-exists mantl
	createdb -O mantl mantl
	$(MAKE) postgres.migrate
.PHONY: postgres.reset

# run the server test suite
server.test.all:
	$(NPM_BIN)/mocha --config src/api/.mocharc.js src/api/tests/
.PHONY: server.test.all

# run database tests only
server.test.db:
	$(NPM_BIN)/mocha --config src/api/.mocharc.js src/api/tests/database.spec.js
.PHONY: server.test.db

# run the server test suite and re-run when files change
server.test.watch:
	$(NPM_BIN)/mocha --config src/api/.mocharc.js src/api/tests/ --watch
.PHONY: server.test.watch
