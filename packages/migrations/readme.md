# deepcase migrations

## install

- Before all create `.env` file.
  ```sh
  HASURA_PATH='?'
  HASURA_SSL=1

  APP_NAME='@deepcase/migrations'
  ```
- Optional `.env` options.
  ```sh
  NODES_MP__SCHEMA_NAME='public'
  NODES_MP__TABLE_NAME='nodes__mp'
  NODES__SCHEMA_NAME='public'
  NODES__TABLE_NAME='nodes'
  ```