set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE "TramitarteApp";
    CREATE USER docker WITH ENCRYPTED PASSWORD 'docker';
    GRANT ALL PRIVILEGES ON DATABASE "TramitarteApp" TO docker;
EOSQL