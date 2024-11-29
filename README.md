## Pixi JS + Typescript + Vite template

### A template that combines the power of typescript and efficiency of pixi.js!

**For clean code dvelopment**

:white_check_mark: pixi `version 7` \
:white_check_mark: vanilla typescript \
:white_check_mark: for game development

### Tags

#### `0.1.x`

**Compatible with pixi.js `v8.x`**

> template is uses modern version of pixi.js \
> this template is **not** compatible with old pixi libs as pixi/layers and pixi/lights

#### `0.0.x`

**Compatible with pixi.js `v7.x`**

> if you prefer to using old pixi libs as @pixi/layers or @pixi/lights \
> I recommended you use this template with version `0.0.x`

`0.0.x` tags are also compatible with libraries:

- pixi/layers
- pixi/lights

### Branches

- `main` or `template-pixi8/stable` is stable version of pixi8 template

- `template-pixi8/dev` is branch of pixi v8.x template development

- `template-pixi7/stable` is stable version of pixi v7.x template

- `template-pixi7/dev` is branch of pixi7 template development

### Folder Structure

```sh
\public # for static content
\src    # source code
    \api        # for external api
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

> The solution uses the **MVP** design \
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

### Installed deps

**dependencies**

- pixi.js
- @pixi/sound
- @pixi/gif
- @pixi/lights
- @pixi/layers

**dev-dependencies**

- typescript
- vite

### Requirements

:white_check_mark: **OS** `Linux`, `win32`, `macOS` \
:white_check_mark: **NodeJS** `^18.x`

#### Source

[pixi elementals](https://www.pixijselementals.com/#before-we-even-start) \
[pixi js official website](https://pixijs.com/) \
[vite guide](https://vitejs.dev/guide/) \
[typescript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
