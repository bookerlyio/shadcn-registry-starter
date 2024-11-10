# ShadCN Component Registry Starter

This project is designed to create a component registry for your own components, enabling them to be used seamlessly with the `shadcn` CLI.

## Unofficial

This project is a collection of the neccesary files from the [shadcn/ui](https://ui.shadcn.com/) project. If there comes a time where official tooling is built, I will deprecrate this starter and recommend that one.

Seems as if shadcn has plans for this in the future, and I will update this as and when 🙂

- https://x.com/shadcn/status/1836862422675771822

## Usage

- Add the code you want, based on its category if wanted, in to registry folder.
- Add the new component to the relevant registry file (e.g for UI components, registry-ui)
- Run 'pnpm run build-registry'
- The files generated in public/r (or REGISTRY_PATH see below) can now be hosted somewhere
- Install the new component with `npx shadcn add https://YOURURL/r/default/navbar.json`
- - Take note of the style name, new-york would be `npx shadcn add https://YOURURL/r/new-york/navbar.json`

## Packages Used

The following packages are needed for the script:

- [`lodash.template`](https://www.npmjs.com/package/lodash.template): ^4.5.0
- [`rimraf`](https://www.npmjs.com/package/rimraf): ^6.0.1
- [`ts-morph`](https://www.npmjs.com/package/ts-morph): ^23.0.0
- [`zod`](https://www.npmjs.com/package/zod): ^3.23.8

and of course typescript is used. In this project I jsut run the script with TSX.

## Registry Path / Public Folder

All necessary files that need to be hosted are saved to the `REGISTRY_PATH`, which defaults to `public/r`. This directory contains the compiled and processed components required for your registry.

## Registry Folder

The `registry` folder is where you add your component code and register components to the schema. By organizing your components here, you ensure they are correctly recognized and managed by the registry system.

## **registry**

This folder is not needed and is an implementation detail from the ShadCN docs. In an effor to not modify anything as much as possible, so that merging future changes is easier, I have left it out.
