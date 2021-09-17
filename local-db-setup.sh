#!/usr/bin/env bash

echo "Installing Homebrew"
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew -v
echo "Installing Postgres"
brew install postgres
psql --version
echo "Postgres Installed"
echo "Starting Postgres"
brew services start postgres
createuser -s postgres
echo "Creating Database crowdsource_db_local"
createdb crowdsource_db_local
echo "Migrating to local DB"
export DATABASE_URL=postgresql://localhost/crowdsource_db_local?user=postgres
cd crowdsource-api && npx db-migrate up
echo "Migration complete"