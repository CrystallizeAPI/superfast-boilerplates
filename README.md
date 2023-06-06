# Superfast Boilerplates Mono Repository

This repository holds the different version of the Crystallize Superfast Boilerplate for each framework.

This repository is a mono repository that is spreading all the framework version to their own repository.

All contributions will happen here:

-   PRs and Issues are therefore open, discuss, contribute in one place
-   Many things will be shared accross the `frameworks`: Coding Standards, CI & Automations, Tests, etc.
-   `shared` folder must remain agnostic of any framework specific things. (`bridges` are used to manage specifics)

✅ Nevertheless, all the `frameworks` will continue to be independant and pushed in their own repository.

## Managed Repositories

| Boilerplates                                                   | Licence(s) |
| -------------------------------------------------------------- | ---------- |
| [Remix Run](https://github.com/CrystallizeAPI/furniture-remix) | ![MIT]     |
| [NextJS](https://github.com/CrystallizeAPI/furniture-nextjs)   | ![MIT]     |

## Requirements

-   Node 18+
-   `rsync`
-   `make`
-   Caddy Server v2

## Contributions

-   Pull Requests and Issues should start with `[$FRAMEWORK_NAME]`

## Working on the project

Remember to use `make`, you will have a list of available targets.

### Structure

-   `.github`: this repository automations
-   `.vscode`: this repository VSCode config
-   `frameworks`: each sub-folder is a Framework that gets its own repository
-   `shared`: all the code that is shared accrod the different frameworks. In this repository the shared folders are shared via symlinks, in their own repository symlinks are removed and replaced by the shared folders. Making the framework repository 100% standalone.
-   `tools`: tooling to manage this repository.

### Installation

There is a `Makefile` and different targets that you MUST use in order to run each framework correctly.

-   `make install`: will install all the libraries while checking the dependencies.

### Running the different versions

-   `make serve-remix-run`: will run the Remix Run boilerplate.
-   `make serve-nextjs`: will run the NextJS boilerplate.

> Note: `make serve-*` targets rely on the `Makefile` of the framework boilerplate itself.

### Coding Standards

`make codeclean` will take care of the codebase.

### Tests

`make tests` will run all tests on the different frameworks

[mit]: https://img.shields.io/badge/license-MIT-green?style=flat-square&labelColor=black
