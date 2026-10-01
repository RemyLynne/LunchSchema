<!--TODO: justfile-->

# Building

Building of the application is done in two steps, frontend then backend

This order is explicit, as the backend will automatically pull the frontend's build files, as to host it in production

## Build frontend

```bash
cd WebContent
pnpm install --frozen-lockfile
pnpm build
```

## Build backend

```bash
./gradlew bootjar
```

The executable jar file should now be available in `./build/libs/`