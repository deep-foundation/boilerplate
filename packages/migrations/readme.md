# deepcase migrations

## install

- Before all create `.env` file.
  ```sh
  HASURA_PATH='localhost:8080'
  HASURA_SSL=0
  HASURA_SECRET='myadminsecretkey'

  APP_NAME='@deepcase/migrations'
  ```
- Optional `.env` options.
  ```sh
  NODES_MP__SCHEMA_NAME='public'
  NODES_MP__TABLE_NAME='nodes__mp'
  NODES__SCHEMA_NAME='public'
  NODES__TABLE_NAME='nodes'

  AUTH_RS_NAME='auth'
  AUTH_RS_PATH='http://dockerhost:4000/api/auth/hrs'
  ```

## publish

```sh
npm run publish
```