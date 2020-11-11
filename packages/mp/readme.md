# deepcase materialized-path

Must be realized:

- [ ] allow insert only filled links, with .from and .to, or without both
- [ ] deny update .from and .to

## install

- Before all create `.env` file.
  ```sh
  HASURA_PATH='localhost:8080'
  HASURA_SSL=0
  HASURA_SECRET='myadminsecretkey'

  APP_NAME='@deepcase/mp'
  ```
- Optional
  ```sh
  DELAY=0
  ```