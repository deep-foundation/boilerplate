# deepcase app

## install

- Before all create `.env` file.
  ```sh
  HASURA_PATH='?'
  HASURA_SSL=1
  HASURA_SECRET='?'
  HASURA_CLIENT='?'
  POSTGRES='postgres://?:?@?:5432/?'

  HOST_URL='http://localhost:3010'

  AUTH_LOGIN='/'
  GITHUB_CLIENTID='?'
  GITHUB_CLIENTSECRET='?'

  APP_NAME='deepcase'
  ```
- Before capacitor build.
  ```sh
  mkdir -p ./.next && ln -s ~/android-studio/ ./.next/android-studio
  ```

## workflow

### android

```sh
npm run build
npm run export
npx cap copy android
npx cap open android
```

### ios

```sh
npm run build
npm run export
npx cap copy ios
npx cap open ios
```

sync cap

```sh
npx cap update
```

sync cap with xcode

```sh
npx cap sync
```

### web

serve

```sh
npx cap serve
```

### capacitor

```sh
ASSET_PREFIX='.' npm run build && ASSET_PREFIX='.' npm run export && npx cap copy electron && npx cap open electron
```
