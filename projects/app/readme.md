# deepcase app

## install

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