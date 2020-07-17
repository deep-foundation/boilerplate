# deepcase boilerplate

## install

- Global
  - Create `~/.npmrc`.
  ```sh
  //npm.pkg.github.com/:_authToken=<GITHUB_TOKEN>
  registry=https://registry.npmjs.org
  @deepcase:registry=https://npm.pkg.github.com
  ```
  - Install `rush`: `npm install -g @microsoft/rush`
- Local
  - Clone this repo and `cd` into it.
  - Run `rush update`
