# deepcase hasura

fake development infrastructure of postgresql and hasura

## attention

- fixed versions of postgresql and hasura in docker-compose can be updated only as PR with checking all consequences

## install

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- `(cd ./packages/hasura && docker-compose up -d)`

## make dump

- create dump file `docker exec hasura_postgres_1 pg_dump postgres://postgres:postgrespassword@localhost:5432/postgres -O -x --schema=public -f dump.sql`
- save into repo `(cd packages/hasura && docker cp hasura_postgres_1:dump.sql dump.sql)`