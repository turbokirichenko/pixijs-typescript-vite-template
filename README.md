## Pixi JS + Typescript + Vite template

### A template that combines the power of typescript and efficiency pixi.js !

**For clean code dvelopment**

:white_check_mark: pixi version 7 \
:white_check_mark: vanilla typescript \
:white_check_mark: for game development \

### Files

```sh
\public # for static content
\src    # source code
    \api        # external api
    \app        # app bootstrap
    \entities   # logical entities (user, admin, ...)
    \plugins    # used plugins (store, pixi, axios, ...)
        \engine     # pixi.js classes
        \storage    # game internal storage
        \web        # browser api
    \shared     # shared libs (configs, global constants, utils, ...)
        \configs
            manifest.ts # pixi.js manifest config
        \constants
        \utils
    \ui         # pixi.js user interfaces
        \animations
        \containers
        \scenes
        \sprites
        \textures
    main.ts     # entrypoint
```

### Architecture

> The solution uses the MVP design \
> This means that the logic of the application must **be independent** of the user interface

1. **Entities** \
   main logic of app
2. **Plugins** \
   core modules that used entities
3. **Shared** \
   libs, config, utils, ...
4. **UI** \
   views

```

(Entities) <-- (Plugins) <-- (Shared) <-- (UI) <-- (Shared | AppBootstrap)

```

### Quick start

**intsllation**

```bash
$ cd pixijs-typescript-vite-template
$ npm install
$ npm run dev -- --host
```

**build**

```
$ npm run build
```

### Docker

```bash
$ cd pixijs-typescript-vite-template
$ docker build -t pixi-template .
$ docker run --name pixi-container -p 5173:5173 pixi-template
```

#### Source

[pixi elementals](https://www.pixijselementals.com/#before-we-even-start)
[pixi js official website](https://pixijs.com/)
[vite guide](https://vitejs.dev/guide/)
[typescript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
